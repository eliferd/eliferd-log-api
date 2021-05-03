import * as dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.LOGAPI_PORT || 4000;

app.listen(PORT, () => console.log(`L'application s'éxecute actuellement sur le port ${PORT}`));
