
//product.controller.js
const productDataService = require('../services/product.service');
const chalk = require('chalk');
const E = require('../errors');
const util = require('util');
exports.handleCreateProduct = async (req,res,next) => {
    console.log(chalk.magenta( 'product.controller.js>>>handleCreateProduct route handler method'));
    let { productName,brandId } = req.body;
    let errors = [];
    //Too much code here, need to simplify the code to achieve the same desired result
    if((productName===undefined)||(productName.trim().length===0)){
        errors= [ ...errors, 
          new E.ParameterError({parameter:'Product name',value:'Empty product name',
          message:'The product name is required.'})
        ];
    }
    if((brandId===undefined)||(brandId.trim().length===0)){
        errors =[...errors,
            new E.ParameterError( {parameter:'Brand key',value:'Empty brand key',
            message:'The brand key is required.'})
        ];
       }
     if (errors.length>0){  
     let dataError =    new E.DataError({errors:errors});
     console.log(util.inspect(dataError))   ;
     return next(dataError);
     }
    try{
    const result = await productDataService.createProduct({productName,brandId});
    processedResult ={ productId: result.product_id,productName: result.product_name, brandId: result.brand_id, 
        createdAt: result.created_at, updatedAt:result.updated_at }
       return res.status(200).send({ok:true,message:'Completed.',errors:[],data:processedResult})
    }catch(error) {
        return next(error); 
    }
}//End of handleCreateProduct route handler


