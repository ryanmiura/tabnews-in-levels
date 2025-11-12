import mongoose from 'mongoose';

const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI não está definido nas variáveis de ambiente');
    }

    // Configurações de conexão
    const options = {
      // useNewUrlParser e useUnifiedTopology são padrão no Mongoose 6+
      // mas podemos adicionar outras configurações se necessário
    };

    // Conectar ao MongoDB
    const conn = await mongoose.connect(mongoUri, options);

    console.log('MongoDB conectado com sucesso!');

  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDatabase;
