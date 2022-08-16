//brand.service.js (with okay code)
const {pool}  = require('../config/pg');
const chalk = require('chalk');
const E = require('../errors');
const util = require('util');
const fns = require('date-fns');
module.exports.updateBrand =async  ({brandName,brandUrl,brandId}) =>  {
    console.log(chalk.greenBright('brand.service.js>>>updateBrand data service method>>>[start]'));
    const client = await pool.connect(); 
    try {
        console.log(chalk.greenBright('brand.service.js>>>createBrand data service method>>>[try block]>>>[started] '));
        let query =  `UPDATE  brands SET brand_name=$1, brand_url=$2 WHERE brand_id=$3 RETURNING * ;`;
            result = await client.query(query, [brandName,brandUrl,brandId]);
            console.log(chalk.greenBright('brandservice.js>>>Check result.rows variable after SQL to update brand record.'));
            console.log(chalk.yellow(result.rows)); //Should be a single element array
            console.log(chalk.greenBright('brand.service.js>>>createBrand data service method [try block]>>>[finished] '));
            console.log(chalk.greenBright('return [result.rows] single element array'));
            return result.rows;
    } catch (error) {
        let dataError=null;
        console.log(chalk.greenBright( 'brand.service.js>>>updateBrand data service method [catch block]>>>[started] '));
        console.log(error);
        if (error.code ==='23505') {
            const constraintRuleName = error.constraint;
            let duplicateError=null;
            switch(constraintRuleName){
                case 'uq_brands_brand_name':
                    duplicateError = new E.DuplicateError({parameter:'Brand name',value:brandName});
                    //unexpectedError = false should be use because your code logic worked with database
                    //to detect this possible task which may go wrong and you plan to discribe-the information to the client-side
                    //as well as log the details inside the respective log files.
                    dataError = new E.DataError({errors:[duplicateError],originalError:error,unexpectedError:false});
                    throw (dataError);
                    break;
            case 'uq_brands_brand_url':
                duplicateError = new E.DuplicateError({parameter:'Brand url',value:brandUrl});
                dataError = new E.DataError({errors:[duplicateError],originalError:error,unexpectedError:false});
                throw (dataError);
             break;
             default:
                //unexpectedError should be true because if this part of code is executed, it means that
                //something which is outside your anticipation has happened. But the database error code
                //has helped you suspect that it is still some kind of uniuqe constraint violation.
                //Possible causes can be, you forgot to setup a constraint name for a constraint in your  create table
                //SQL script.
                throw new E.DataError({message:'Input value(s) has been used.',unexpectedError:true});
        }
        }else{
            //In the catch block, I have used the error.constraint and error.code to look out for constraint rule violation error
            //raised by the database. If some other error which is "OUTSIDE" my anticipation
            // is raised by system or db, I have also created an InternalError object to do a status code 500
            //to the client-side. The original error generated by either the system or the postgresql shall be logged into the 
            //log file.
            console.log(chalk.greenBright(util.inspect(error,errorshowHidden=false, depth=2, colorize=true)));
            throw new E.InternalError({originalError:error});
        }
    } finally {
        //https://stackoverflow.com/questions/3837994/why-does-a-return-in-finally-override-try
        //Learning note: finally block always executes regardless there is a return result command at the 
        //try block.
        await client.release(); //Need to release the database connection in the finally block.
        console.log(chalk.greenBright('brand.service.js>>>updateBrand data service method>>>[finally block]>>>[finished]'));
    }
};//End of updateBrand data service method
module.exports.createBrand =async  ({brandName,brandUrl}) =>  {
    console.log(chalk.greenBright('brand.service.js>>>createBrand data service method>>>[started]'));
    const client = await pool.connect(); 
    try {
        console.log(chalk.greenBright('brand.service.js>>>createBrand data service method>>>[try block]>>>[started] '));
        let query =  `INSERT INTO  brands (brand_name, brand_url) VALUES ($1,$2) RETURNING * ;`;
            result = await client.query(query, [brandName,brandUrl]);
            console.log(chalk.greenBright('brand.service.js>>>Check [result.rows] variable after SQL to create a new brand record.'));
            console.log(result.rows); //Should be a single element array
            console.log(chalk.greenBright('brand.service.js>>>createBrand data service method>>>[try block]>>>[finished] '));
            console.log(chalk.greenBright('return [result.rows] single element array'));
            return result.rows;
    } catch (error) {
        let dataError=null;
        console.log(chalk.greenBright( 'brand.service.js>>>createBrand data service method [catch block]>>>[started] '));
        if (error.code ==='23505') {
            const constraintRuleName = error.constraint;
            //console.log(data.text()); /*(Intentionally create a runtime error by using this command)*/
            let duplicateError=null;
            switch(constraintRuleName){
                case 'uq_brands_brand_name':
                    duplicateError = new E.DuplicateError({parameter:'Brand name',value:brandName});
                    //unexpectedError = false should be use because your system code logic worked with database
                    //to detect this possible error and you plan to describe-communicate the error to the client-side.
                    dataError = new E.DataError({errors:[duplicateError],originalError:error,unexpectedError:false});
                    throw (dataError);
                    break;
            case 'uq_brands_brand_url':
                duplicateError = new E.DuplicateError({parameter:'Brand url',value:brandUrl});
                dataError = new E.DataError({errors:[duplicateError],originalError:error,unexpectedError:false});
                throw (dataError);
             break;
             default:
                //unexpectedError should be true because if this part of code is executed, it means that
                //something which is outside your anticipation has happened. But the database error code
                //has helped you suspect that it is still some kind of uniuqe constraint violation.
                //Possible causes can be, you forgot to setup a constraint name for a constraint in your table create
                //SQL script.
                throw new E.DataError({message:'Input value(s) has been used.',originalError:error,unexpectedError:true});
        }
        }else{
            //In the catch block, I have used the error.constraint and error.code to look out for constraint rule violation error
            //raised by the database. If some other error happens (either due to db or programmer mistakes), 
            //The else block here creates an InternalError object and throw it.
            //The errorhandler middleware function uses this object send a status 500 response to the client side.
            //The original error generated by either the system or the postgresql shall be logged into the log file.
            console.log(chalk.greenBright(util.inspect(error,errorshowHidden=false, depth=2, colorize=true)));
            throw new E.InternalError({originalError:error,unexpectedError:true});
        }
    } finally {
        //https://stackoverflow.com/questions/3837994/why-does-a-return-in-finally-override-try
        //Learning note: finally block always executes regardless there is a return result command at the try block.
        await client.release(); //Need to release the database connection in the finally block.
        console.log(chalk.greenBright('brand.service.js>>>createBrand data service method>>>[finally block]>>>[finished]'));
    }
};//End of createBrand data service method

module.exports.deleteBrand =async  ({brandId}) =>  {
    console.log(chalk.greenBright('brand.service.js>>>deleteBrand data service method>>>[started]'));
    const client = await pool.connect();
    try {
        console.log(chalk.greenBright('deleteBrand data service method (try block) '));
        let query =  `DELETE FROM brands WHERE brand_id=$1`;
            result = await client.query(query, [brandId]);
            console.log(result);
            return result;
    } catch (error) {
        console.log(chalk.greenBright( 'brand.service.js>>>deleteBrand data service method>>>[catch block]>>>[started] '));
        if (error.code === '23503') {
            if (error.constraint=='fk_products_brand_id'){
            const businessRuleError = new E.BusinessRuleError({
                message:'Cannot delete brand because there are products tied to the respective brand name.'});
            throw new E.DataError({errors:[businessRuleError],originalError:error});
            }
        }else{
            console.log(chalk.greenBright(util.inspect(error,errorshowHidden=false, depth=2, colorize=true)));
            //http://localhost:8089/api/brands/xxx
            throw new E.InternalError({error,unexpectedError:true});
        }
    } finally {
        await client.release(); //Need to release the database connection in the finally block.
        console.log(chalk.greenBright('brand.service.js>>>deleteBrand data service method>>>[finally block]'));
    }
};
//End of deleteBrand data service method

module.exports.findBrands =async  (searchParameters) =>  {
    const columns = Object.keys(searchParameters);
const values = Object.values(searchParameters);

    console.log(chalk.greenBright('brand.service.js>>>findBrand[s] data service method>>>[started]'));
    const client = await pool.connect();
     console.log(chalk.greenBright('>>>findBrands data service method>>>[try block]>>>[started] '));
     let sql = 'SELECT * FROM brands WHERE ';
     let params = [];

for (let i = 0; i < values.length; i++) {
    //brandName -> brand_name, brandUrl -> brand_url
    //Use ILIKE instead of LIKE for case insensitive search
    sql += columns[i].replace(/(?:^|\.?)([A-Z])/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, "") + ' ILIKE $' + (i+1).toString();
    if (i<values.length-1){
      sql += ' OR '
    }else if(i===values.length-1){
        sql +=';'
    }
    }
    for (let i = 0; i < columns.length; i++) {
        params = [...params,`%${values[i]}%` ]
    }

try{
            let query =  sql;
               const  result = await client.query(query,params);
               console.log(chalk.greenBright('brand.service.js>>>findBrand[s] data service method>>>'));
               console.log(chalk.greenBright('Inspect the result variable after making a search query'));
                console.log(chalk.greenBright(util.inspect(result),errorshowHidden=false, depth=2, colorize=true));
  
                return result.rows;
        } catch (error) {
            console.log(chalk.greenBright( 'findBrands data service method>>>[catch block]>>>[started] '));
                //I cannot anticipate any likely errors I should take care. Therefore,
                //by default, if error happens, I will throw the following type of error.
                throw new E.InternalError({error});
        } finally {
            await client.release(); //Need to release the database connection in the finally block.
            console.log(chalk.greenBright('findBrands data service method>>>[finally block]>>>[finished]'));
        }
};
//End of findBrands data service method

module.exports.findOneBrand =async  ({brandId}) =>  {
    console.log(chalk.greenBright('brand.service.js>>>findOneBrand data service method>>>[started]'));
    const client = await pool.connect();
    try {
        console.log(chalk.greenBright('brand.service.js>> findOneBrand data service method>>>[try block] >>>[started]'));
        let query =  `SELECT * FROM brands WHERE brand_id=$1`;  //If use brand_id=? instead of $1, you get "syntax error at end of input" error
            const result = await client.query(query, [brandId]);

            return result.rows;
    } catch (error) {
        console.log(chalk.greenBright( 'brand.service.js>>>findOneBrand data service method>>>[catch block]>>>[started]'));
            //I cannot anticipate any likely errors I should take care. Therefore,
            //by default, if error happens, I will throw the following type of error.
            throw new E.InternalError({originalError:error});
    } finally {
        await client.release(); //Need to release the database connection in the finally block.
        console.log(chalk.greenBright('brand.service.js>>>findOneBrand data service method>>>[finally block]>>>[finished]'));
    }
};
//End of findOneBrand data service method

