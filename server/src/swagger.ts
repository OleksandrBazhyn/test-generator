import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Test Generator API',
      version: '1.0.0',
      description: 'API documentation for Test Generator backend',
    },
    servers: [
      { url: 'http://localhost:5000/api' }
    ],
    components: {
      schemas: {
        Test: {
          type: 'object',
          properties: {
            question: { type: 'string', example: 'What is 2+2?' },
            options: {
              type: 'object',
              properties: {
                A: { type: 'string', example: '3' },
                B: { type: 'string', example: '4' },
                C: { type: 'string', example: '5' },
                D: { type: 'string', example: '6' }
              },
              required: ['A', 'B', 'C', 'D']
            },
            correct_answer: { type: 'string', example: 'B' }
          },
          required: ['question', 'options', 'correct_answer']
        }
      }
    }
  },
  
  apis: [
    'src/routes/*.ts',
    'src/controllers/*.ts',
    'src/types.ts',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
