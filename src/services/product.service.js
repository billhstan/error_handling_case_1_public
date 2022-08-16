//product.service.js
const {pool} = require('../config/pg');
const chalk = require('chalk');
const E = require('../errors');

module.exports.createProduct =async  ({productName,brandId}) =>  {
    console.log(chalk.yellow('product.service.js>>>createProduct data service method>>>[Started]'));
    const client = await pool.connect();
    
    try {

        console.log(chalk.yellow('product.service.js>>> createProduct data service method [try block]>>>[Started]'));
        let query =  `INSERT INTO products (product_name,brand_id) VALUES ($1,$2) RETURNING *;`;
            result = await client.query(query, [productName,brandId]);
            console.log(result.rows[0]);
            return result.rows[0];
    } catch (error) {
        console.log(chalk.red.blue( 'product.service.js>>> createProduct data service method [catch block]>>>[Started!!!] '));
        console.log(error);
        if (error.code === '23505') {
            if (error.constraint=='uq_products_product_name_brand_id'){
                duplicateError = new E.BusinessRuleError({
                    message:`Another product having the name: ${productName} has been associated to the brand. Use another product name.`
                });
                inputError = new E.InputError({errors:[duplicateError],originalError:error});
                throw (inputError);
            }
        }else{
            throw new E.InternalError({originalError:error});
        }
    } finally {
        //https://stackoverflow.com/questions/3837994/why-does-a-return-in-finally-override-try
        //Learning note: finally block always executes regardless there is a return result command at the 
        //try block.
        await client.release(); //Need to release the database connection in the finally block.
        console.log(chalk.yellow('>>> createProduct data service method (finally block)'));
    }

};
//End of createProduct data service method



