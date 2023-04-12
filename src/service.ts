import Response from "./model";
import axios from "axios";
import * as dotenv from 'dotenv';

dotenv.config();

export async function gptService() {
    

const headerVal = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  };
  const url="https://api.openai.com/v1/chat/completions";

  const data = await Response.findAll({limit: 15, });

  data.forEach((row) => {
    //console.log(row);
    const payload = {
      model :"gpt-3.5-turbo",
      messages:[{role: "user", content: row.dataValues.answertext}],
      temperature :0
    };

    axios.post(url, payload, {headers: headerVal}).then((response) => {
         // console.log(response.data.choices[0].message);
          row.update({chatgptreply: response.data.choices[0].message.content})
  
        })


  });
  
}
