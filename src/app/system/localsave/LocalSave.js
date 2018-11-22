import LocalSaveSystem from './LocalSaveSystem.js';

//Singleton pattern (I know, I'm sorry. But we must.)
const INSTANCE = new LocalSaveSystem();
export default INSTANCE;
