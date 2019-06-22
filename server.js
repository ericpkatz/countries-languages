const express = require('express');
const app = express();
const { syncAndSeed, models } = require('./db');
const { Country, Language }  = models;

syncAndSeed();

const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`listening on port ${port}`));

app.get('/api/countries', async (req, res, next)=> {
  try{
    res.send(await Country.findAll({ include: [ Language ]}));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/languages', async (req, res, next)=> {
  try{
    res.send(await Language.findAll({ include: [ Country ]}));
  }
  catch(ex){
    next(ex);
  }

});
