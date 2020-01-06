'use strict';
module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    nomDeFichier: DataTypes.STRING,
    titre: DataTypes.STRING,
    mime: DataTypes.STRING,
    saveDuring: DataTypes.INTEGER,
    maxDl: DataTypes.INTEGER,
    currentDl: DataTypes.INTEGER,
    url: DataTypes.STRING
  }, {});
  File.associate = function(models) {
    // associations can be defined here
  };
  return File;
};