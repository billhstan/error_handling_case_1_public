
//brand.controller.js
const E = require('../errors');
const brandDataService = require('../services/brand.service');
const chalk = require('chalk');

//util - for development
const util = require('util');
exports.handleCreateBrand = async (req,res,next) => {
    console.log(chalk.magenta( 'brand.controller.js>>>handleCreateBrand route handler method>>>[started]'));
    let { brandName,brandUrl } = req.body;
    let errors = [];
    //Too much code here, need to simplify the code to achieve the same desired result
    if((brandName===undefined)||(brandName.trim().length===0)){
        errors= [ ...errors, 
          new E.ParameterError({parameter:'Brand name',value:'Empty brand name',
          message:'The brand name is required.'})
        ];
    }
    if((brandUrl===undefined)||(brandUrl.trim().length===0)){
        errors =[...errors,
            new E.ParameterError( {parameter:'Brand url',value:'Empty brand url',
            message:'The brand url is required.'})
        ];
       }
     if (errors.length>0){  
     let dataError =    new E.DataError({errors:errors});
     //When creating the DataError object, note that this custom error
     //was programatically raised after a series of data validation operations.
     //Therefore, originalError is not required when preparing the DataError object, dataError.
     console.log(util.inspect(dataError))  ;
     return next(dataError);
     }
    try{
    const result = await brandDataService.createBrand({brandName,brandUrl});
    const processedResult =  {
        brandId: result[0].brand_id,
        brandName:result[0].brand_name,
        brandUrl :result[0].brand_url,
        createdAt: result[0].created_at,
        updatedAt:result[0].updated_at
    };
       return res.status(200).send({statusCode:200,ok:true,message:'Completed.',data:processedResult});
    }catch(error) {
        return next(error); 
    }
}//End of processCreateBrand  route handler
exports.handleUpdateBrand = async (req,res,next) => {
    console.log(chalk.magenta( 'brand.controller.js>>> handleUpdateBrand>>> route handler method [started]'));
    let { brandName,brandUrl } = req.body;
    let brandId = req.params.brandId;
    console.log(chalk.magenta( 'brand.controller.js>>> handleUpdateBrand>>> check the [req.params]>>>[started]'));
    console.log(chalk.yellowBright(util.inspect(req.params,errorshowHidden=false, depth=3, colorize=true)));
    console.log(chalk.magenta( 'brand.controller.js>>> handleUpdateBrand>>> check the [req.params]>>>[finished]'));
    let errors = [];
    //Too much code here, need to simplify the code to achieve the same desired result
    if((brandId===undefined)||(brandId.trim().length===0)){
        errors= [ ...errors, 
          new E.ParameterError({parameter:'Brand key',value:'Empty brand key',
          message:'The brand key is required.'})
        ];
    }    
    if((brandName===undefined)||(brandName.trim().length===0)){
        errors= [ ...errors, 
          new E.ParameterError({parameter:'Brand name',value:'Empty brand name',
          message:'The brand name is required.'})
        ];
    }
    if((brandUrl===undefined)||(brandUrl.trim().length===0)){
        errors =[...errors,
            new E.ParameterError( {parameter:'Brand url',value:'Empty brand url',
            message:'The brand url is required.'})
        ];
       }
     if (errors.length>0){  
        console.log(chalk.magenta( 'brand.controller.js>>> handleUpdateBrand>>>Validation errors detected>>>'));
        console.log(chalk.magenta('Building DataError object [started]'));
    //Note that all input validation checks are down "outside" the try block which has the data service operation logic.    
     //When creating the DataError object, you see this as an expectedError to be false because
     //you have anticipated the possibilities of missing inputs in the request and provided code to detect them.   
     let dataError =    new E.DataError({errors:errors,unexpectedError:false});
     //When creating the DataError object, note that this custom error
     //was programatically raised after a series of data validation operations.
     //Therefore, originalError is not required when preparing the DataError object, dataError.
     console.log(chalk.yellowBright(util.inspect(dataError)))  ;
     console.log(chalk.yellow( 'brand.controller.js>>> handleUpdateBrand>>> Building DataError object [finished]'));
     console.log(chalk.magenta('brand.controller.js>>>handleUpdateBrand>>>calling return next(dataError)'));
     console.log(chalk.magenta('brand.controller.js>>>Let the errorhandler middleware function decide how to:'));
     console.log(chalk.magenta('report error and response to client-side '));
     return next(dataError);
     }
    try{
    const result = await brandDataService.updateBrand({brandId,brandName,brandUrl});
    const processedResult =  {
        brandId: result[0].brand_id,
        brandName:result[0].brand_name,
        brandUrl :result[0].brand_url,
        createdAt: result[0].created_at,
        updatedAt:result[0].updated_at
    };
       return res.status(200).send({statusCode:200,ok:true,message:'Completed.',data:processedResult});
    }catch(error) {

        return next(error); 
    }
}//End of handleUpdateBrand  route handler
exports.handleDeleteBrand = async (req,res,next) => {
    console.log(chalk.magenta( 'brand.controller.js>>>handleDeleteBrand route handler method>>>[Started]'));
    let { brandId } = req.params;
    let errors = [];
    //Too much code here, need to simplify the code to achieve the same desired result
    if((brandId===undefined)||(brandId.trim().length===0)){
       errors=[...errors,
          new ParameterError({parameter:'Brand key',value:'Empty brand key.',
          message:'The brand key is required.'})
       ];
    }
     if (errors.length>0){  
     let dataError =    new E.DataError({errors:errors,unexpectedError:false});
     console.log(util.inspect(dataError))   ;
     return next(dataError);
     }
    try{
    const result = await brandDataService.deleteBrand({brandId});
    if (result.rowCount===1){
       return res.status(200).send({statusCode:200,ok:true,message:'Completed.',data:[]})
    }else{
        return res.status(404).send({statusCode:404,ok:true,message:'The record does not exist..',data:[]})
    }
    }catch(error) {
        return next(error); 
    }
}//End of handleDeleteBrand  route handler

exports.handleSearchOneBrand = async (req,res,next) => {
    console.log(chalk.magenta( '>>> handleSearchOneBrand route handler method'));
    console.log(req.query);
    let errors=[];
    let {brandId} = req.params;
    if((brandId===undefined)||(brandId.trim().length===0)){
      errors=[...errors,
         new ParameterError({parameter:'Brand key',value:'Empty brand key.',
         message:'The brand key is required.'})
      ];
   }
   if (errors.length>0){  
      let dataError =    new E.DataError({errors:errors});
      console.log(util.inspect(dataError,{ showHidden: false, depth: 0, colorize: true }))   ;
      return next(dataError);
      }

        try{
            const result = await brandDataService.findOneBrand({brandId});
            const processedResult =   {
                brandId: result[0].brand_id,
                brandName:result[0].brand_name,
                brandUrl :result[0].brand_url,
                createdAt: result[0].created_at,
                updatedAt:result[0].updated_at
            };
               return res.status(200).send({statusCode:200,ok:true,message:'Completed.',data:processedResult})
            }catch(error) {
                return next(error); 
            }
        
     

    }//End of handleSearchOneBrand route handler
  
    exports.handleSearchBrands = async (req,res,next) => {
      console.log(chalk.magenta( 'brand.controller.js>>> handleSearchBrands route handler method>>>[Started]'));
      let {brandName,brandUrl} = req.query;
      //There are some validations required for this method.
      //So that unnecessary database operations are avoided.
      //For example, it is meaningless to search brand for inputs such as empty string
      //Validations for search input are heavily influenced by the use cases discussed with customers and users.
      brandName = brandName?brandName:'';
      brandUrl = brandUrl?brandUrl:''; //To avoid having undefined inside the dynamic search SQL later.

          try{
              const result = await brandDataService.findBrands({brandName,brandUrl});
              const processedResult = result.map((element)=>{return {
                brandId: element.brand_id,
                brandName:element.brand_name,
                brandUrl : element.brand_url,
                createdAt: element.created_at,
                updatedAt:element.updated_at
            }})
            console.log('processedResult variable : ' , processedResult);
                 return res.status(200).json({statusCode:200,ok:true,message:`Completed. ${processedResult.length} brand records.`,data:processedResult})
              }catch(error) {
                  return next(error);//Capture any error or custom error raised by the brandDataService.findBrands 
              }
  
      }//End of handleSearchBrands route handler
  
  