const http = require('http');
const url = require('url');

const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });

const API_KEY = process.env.API;
const API_PATH = `http://api.weatherstack.com/current?access_key=${API_KEY}`;

let app = {
    init: function()
    {
        this.run();
    },

    run: function()
    {
        let self = this;

        rl.question(
            'Введите название города (на англ.): ', 
            (answer) => {    
                self.send(answer);
            }
        );
    },

    runAgain: function() {
        let self = this;

        rl.question(
            'Повторить запрос? (Y/N) ', 
            (answer) => {

                if (answer == 'Y' || answer == 'y') {
                    self.run();
                }
                else if(answer == 'N' || answer == 'n') {
                    console.log('Пока-пока!');
                    rl.close();
                }
                else {
                    console.log('Не удалось распознать команду. Попробуйте еще раз.');
                    self.runAgain();
                }
            }
        );
    },

    send: function(city)
    {
        let self = this;
        let myURL = new URL(API_PATH);
        myURL.searchParams.append('query', city);

        http.get(myURL, (res) => {
            const {statusCode} = res
            if (statusCode !== 200){
                console.log(`statusCode: ${statusCode}`);
                self.runAgain();
            }
            else {
                res.setEncoding('utf8')
                let rowData = ''
                res.on('data', (chunk) => rowData += chunk)
                res.on('end', () => {
                    let parseData = JSON.parse(rowData)
                    console.log(parseData.current)
                    self.runAgain();
                })
            }
        }).on('error', (err) => {
            console.log(err)
        })
    }
};

app.init();
  