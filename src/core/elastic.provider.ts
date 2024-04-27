import { ElasticsearchModule } from '@nestjs/elasticsearch';

export const elasticsearchProviders = [
  ElasticsearchModule.register({
    nodes: ['http://95.85.121.153:9200'],
    auth: {
      username: 'elastic',
      password: '',
    },
    tls: {
      rejectUnauthorized: false,
    },
  }),
];
