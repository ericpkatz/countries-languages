const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_places_db');

const Country = conn.define('country', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  visited: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

const Language = conn.define('language', {
  name: Sequelize.STRING
});

Country.belongsTo(Language);
Language.hasMany(Country);

const syncAndSeed = async()=> {
  await conn.sync({ force: true });
  const countryNames = ['England', 'US', 'France', 'Canada'];
  const [ england, us, france, canada ] = await Promise.all(countryNames.map(name => Country.create({ name})));
  const languageNames = ['English', 'French', 'Portugese'];
  const [english, french, portugese] = await Promise.all(languageNames.map( name => Language.create({ name })));
  us.languageId = english.id;
  england.languageId = english.id;
  france.languageId = french.id;
  await Promise.all([us.save(), england.save(), france.save()]);
};

module.exports = {
  models: {
    Country,
    Language
  },
  syncAndSeed
};

