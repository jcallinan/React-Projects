## Backend server

## Note
may need to regenerate hashed password:

`node -e "const b = require('bcryptjs'); b.hash('password123', 10).then(h => console.log(h))"`