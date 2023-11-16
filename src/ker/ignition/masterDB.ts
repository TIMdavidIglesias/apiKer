// METADATA
import { _databases } from "../../../setup/metadata/_databases";

// CORE
import { Log } from "../core/log";
import { MasterDatabase } from "../core/databases/master";
import { exit } from "process";
import { IMongoDatabaseCache } from "../models/databases/mongo/types";

const LOG_MESSAGES = {
  DATABASES_FAIL_MASTER_ERROR: "[IGNITION] [DATABASE] -> No master database found",
  CONNECTING_TO_MASTER_DB: "[IGNITION] [DATABASE] -> Connecting to Master Database...",
  MONGO_MASTER_DB_OK: "[IGNITION] [DATABASE] [OK] Connection successful.",
  MONGO_MASTER_DB_FAIL: "[IGNITION] [DATABASE] [FAIL] Connection failed.",
};

/**
 * Initializes the core of the API server, specifically handling the database setup.
 * 
 * This function checks the integrity of database metadata, connects to the master database,
 * and handles any potential errors during these processes.
 */
export const initializeMasterEnvironmentDatabase = async () => {
  // Check setupData databases file
  let masterDBObject = _databases.find(db=>db.metadata.dbRole === 'master') as IMongoDatabaseCache

  if(!masterDBObject){
    Log.logAddEntry(LOG_MESSAGES.DATABASES_FAIL_MASTER_ERROR, 3);
    exit();
  }

  // Connect to the master database
  try {
    Log.logAddEntry(LOG_MESSAGES.CONNECTING_TO_MASTER_DB, 1);
    // performs the master connection
    await MasterDatabase.connect(masterDBObject);
    Log.logAddEntry(LOG_MESSAGES.MONGO_MASTER_DB_OK, 2);
  } catch (exception) {
    Log.logAddEntry(LOG_MESSAGES.MONGO_MASTER_DB_FAIL, 3);
    throw exception;
  }
};
