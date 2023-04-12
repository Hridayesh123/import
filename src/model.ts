import {db} from "./db"; 
import { DataTypes } from "sequelize";

const Response = db.define("responses", {
    responseid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    answertext: DataTypes.STRING,
    chatgptreply: DataTypes.TEXT,
  },{
    timestamps : false,
  });

  export default Response;