const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json('invalid form submission');
  }

  const hash = bcrypt.hashSync(password);

  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into('login')
      .returning('email')
      .then((loginEmail) => {
        // used the returned email
        return db('users')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .returning('*')
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback); // if failed, rollback the changes
  }).catch((err) => res.status(400).json('unable to register'));
};

module.exports = {
  handleRegister: handleRegister,
};
