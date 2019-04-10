module.exports = {
    url: 'mongodb://localhost:27017/kniot',
    PORT: 3000,
	  signOptions: {
		expiresIn: '24h',
		algorithm : "RS256"
	  }
	};
