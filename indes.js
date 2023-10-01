const keccak256 = require('keccak256');

const name = 'Eric';
const email = 'glickflick3@gmail.com';
const address = 'Banasthali, kathmandu';


function hash_of_3(name,email,address) {
    const firstHash = '0x' + keccak256(name).toString('hex');
    const secondHashInput = firstHash + email;
    const secondHash = '0x' + keccak256(secondHashInput).toString('hex');
    const thirdHashInput = secondHash + address;
    const thirdHash = '0x' + keccak256(thirdHashInput).toString('hex');

    console.log('First Hash:', firstHash);
    console.log('Second Hash:', secondHash);
    console.log('Third Hash:', thirdHash);
}

hash_of_3(name,email,address);

// change in name results change in all 
console.log("changed name")

hash_of_3(name + 'Adhikari',email,address);