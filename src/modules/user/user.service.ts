import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserType } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AppResponse } from 'src/core/app.types';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Workbook } from 'exceljs';
import { extname } from 'path';

const IndexName = 'users';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly elastic: ElasticsearchService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<AppResponse> {
    try {
      const user = new User();
      user.description = createUserDto.description;
      user.fullName = createUserDto.fullName;
      user.phone = createUserDto.phone;
      user.type = createUserDto.type;
      user.region = createUserDto.region;
      const insertedUser = await this.usersRepository.save(user);
      await this.createIndex();
      await this.elastic.index({
        index: IndexName,
        body: {
          suggest: `${createUserDto.fullName} ${createUserDto.description} ${createUserDto.region} ${createUserDto.phone}`,
          text: `${createUserDto.fullName} ${createUserDto.description} ${createUserDto.region} ${createUserDto.phone}`,
          user_id: `${insertedUser.id}`,
        },
      });
      return {
        error: false,
        message: 'Created successfully',
        data: insertedUser,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  findAll() {
    return this.usersRepository.find();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const result = await this.usersRepository.update(id, updateUserDto);
      return result;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      const result = await this.usersRepository.delete(id);
      return result;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  filter(region: string, type: string) {
    let where = {};

    if (region) {
      where = {
        ...where,
        region: region,
      };
    }

    if (type) {
      const t = type == UserType.PARNIK ? UserType.PARNIK : UserType.ZAWOD;
      where = {
        ...where,
        type: t,
      };
    }
    return this.usersRepository.findBy(where);
  }

  async search(query: string) {
    const result = await this.elastic.search({
      index: IndexName,
      body: {
        query: {
          bool: {
            must: {
              multi_match: {
                query: query,
                fuzziness: '8',
                fields: ['text'],
                minimum_should_match: '75%',
                type: 'most_fields',
              },
            },
          },
        },
      },
    });
    return result.hits.hits;
  }

  async createIndex() {
    const exist = await this.elastic.indices.exists({
      index: IndexName,
    });
    if (!exist) {
      await this.elastic.indices.create({
        index: IndexName,
        settings: {
          index: {
            number_of_shards: 1,
            analysis: {
              analyzer: {
                trigram: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'shingle'],
                },
              },
              filter: {
                shingle: {
                  type: 'shingle',
                  min_shingle_size: 2,
                  max_shingle_size: 3,
                },
              },
            },
          },
        },
      });
      await this.elastic.indices.putMapping({
        index: IndexName,
        body: {
          properties: {
            suggest: {
              type: 'completion',
            },
            text: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                },
              },
            },
            user_id: {
              type: 'text',
            },
          },
        },
      });
    }
  }

  async extractFromExcel(file: Express.Multer.File): Promise<any> {
    try {
      const workbook = new Workbook();
      await workbook.xlsx.readFile(file.path);
      const worksheet = workbook.getWorksheet();
      // console.log(worksheet);
      const data = [];
      worksheet.eachRow({ includeEmpty: true }, (row) => {
        const rowData = {};
        row.eachCell((cell, colNumber) => {
          rowData[colNumber] = cell.value;
        });
        data.push(rowData);
      });
      // return data;
      let users: User[] = [];
      const result = [];
      if (data) {
        users = data
          .filter((_, index) => index != 0)
          .map((it) => {
            const newUser = new User();
            newUser.fullName = `${it[4]}`;
            newUser.phone = `${it[5]}`.trim();
            newUser.description = `${it[3] ? it[3] : ''}`;
            newUser.region = `${it[2] ? it[2] : 'Ashgabat'}`.trim();
            newUser.type = it[1]
              ? `${it[1]}`.toLowerCase().includes('завод')
                ? UserType.ZAWOD
                : UserType.PARNIK
              : UserType.PARNIK;
            return newUser;
          });
        for (let i = 0; i < users.length; i++) {
          result.push(await this.usersRepository.save(users[i]));
        }
        return result;
      } else {
        throw new BadRequestException('Excel file is empty');
      }
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};
