import bcrypt from 'bcrypt';

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [7, 42],
      },
    },
  });

  User.associate = models => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
  };

  User.findByLogin = async login => {
    let existingUser = await User.findOne({
      where: { username: login },
    });
    if (!existingUser) {
      existingUser = await User.findOne({
        where: { email: login },
      });
    }
    return existingUser;
  };

  User.beforeCreate(async newUser => {
    newUser.password = await newUser.generatePasswordHash();
  });

  User.prototype.generatePasswordHash = async function() {
    const saltRounds = 10;
    try {
      return await bcrypt.hash(this.password, saltRounds);
    } catch (error) {
      throw new Error(error);
    }
  };

  User.prototype.validatePassword = async function(password) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      throw new Error(error);
    }
  };

  return User;
};
export default user;
