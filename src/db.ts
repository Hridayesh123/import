import { Sequelize } from "sequelize";
import Response from "./model";
import * as fs from "fs";
import csv from "csv-parser";
  
export const db = new Sequelize("chatgpt", "postgres", "admin", {
    host: "localhost",
    dialect: "postgres",
  });


interface row {
  answerresultid: number;
  answertext_NL: string;
  answertext: string;
}

export async function seedDB() {
  let allRows: row[] = await readCsv(
    "C:/Users/pc/Documents/SentimentResultsNLO.csv"
  );

  for (var i = 0; i < allRows.length; ++i) {
    try {
      let row = allRows[i];

      const created = await Response.create({
        responseid: row.answerresultid,
        answertext: row.answertext_NL,
      });
    } catch (error) {
      continue;
    }
  }
  console.log("database seeded");
  
}

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
