import * as fs from "fs";
import csv from "csv-parser";
import { Client } from "pg";
import { Sequelize } from "sequelize";
import { DataTypes } from "sequelize";
import * as https from "https"
// require('dotenv').config();
import * as dotenv from 'dotenv';
import axios from "axios";

dotenv.config();

interface row {
  answerresultid: number;
  answertext_NL: string;
  answertext : string
}
const connectDb = async (): Promise<any> => {


  const sequelize = new Sequelize("chatgpt", "postgres", "admin", {
    host: "localhost",
    dialect: "postgres",
  });

  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection successful");
    })
    .catch((error) => {
      console.log(error);
    });

  const response = sequelize.define("responses", {
    responseid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    answertext: DataTypes.STRING,
    chatgptreply: DataTypes.TEXT,
  },{
    timestamps : false,
  });

 

  let allRows: row[] = await readCsv(
    "C:/Users/pc/Documents/SentimentResultsNLO.csv"
  );

  const headerVal = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  };
  const url="https://api.openai.com/v1/chat/completions";

  const data = await response.findAll({limit: 15, });

  data.forEach((row) => {
    const payload = {
      model :"gpt-3.5-turbo",
      messages:[{role: "user", content: row.dataValues.answertext}],
      temperature :0
    };

    axios.post(url, payload, {headers: headerVal}).then((response) => {
          console.log(response.data.choices[0].message);
          row.update({chatgptreply: response.data.choices[0].message.content})
          // row.update({ lastName: "Doe" }, {
          //   where: {
          //     lastName: null
          //   }
          // });
        })


  });



  
//   for (let i=0 ; i<data.length ; i++){
 
// const payload = {
//       model :"gpt-3.5-turbo",
//       messages:[{role: "user", content: data[i].answertext}],
//       temperature :0
//     };
//   // const answer = await axios.post(url, payload, { headers: headerVal }).then((response) => {
//   //   console.log(response);
//   // //   let data = "";
//   // //   response.on("data", (chunk) => {
//   // //     data += chunk;
//   // //   });
//   // //   response.on("end", () => {
//   // //     console.log(JSON.parse(data));
//   // //   });
//   // // }).on("error", (error) => {
//   // //   console.error(error);
//   // });

//   const resp = await axios.post(url, payload, {headers: headerVal}).then((response) => {
//     console.log(response.data.choices[0].message);
//     await response.update({ lastName: "Doe" }, {
//       where: {
//         lastName: null
//       }
//     });
//   })
  
  
}
connectDb();

async function readCsv(path): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    let myMap: row[] = [];
    fs.createReadStream(path)
      .pipe(csv())

      .on("data", (row: any) => {
        myMap.push(row);
      })

      .on("end", () => {
        resolve(myMap);
      })

      .on("error", reject);
  });
}


