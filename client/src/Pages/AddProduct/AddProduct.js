import React,{ useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-bootstrap';
import styles  from  './AddProduct.module.css';
import { Context } from '../../Context/appContext';
import { Link } from 'react-router-dom';
const Feedback = ({serverSideFeedback})=>{
  const {ok,errors,message}=serverSideFeedback;
  console.log('AddProduct.js>>>Feedback>>>Check the three inputs:');
  console.log('Inspect the [ok] variable');
  console.log(ok);
  console.log('The ok input parameter should have either, null, true or false. As a result, you need to be careful with the conditional statement.');
  console.log((ok==null)?'The ok input is null. Therefore the the else block should execute. ':'The ok input is not null, something should be displayed.');
  console.log('Inspect the [message] variable');
  console.log(message?message:'The message variable is empty string');
  console.log('Inspect the [errors] variable');
  console.dir(errors?errors:'The errors is null.');
  if (ok==true) {
    return (
      <Alert role="alert" className="alert alert-success h-100" variant="success">
        {message}
      </Alert>
    );
  } else if ((ok==false) && message.trim() != '' && errors?.length > 0) {
    return (
      <Alert role="alert" className="alert alert-danger h-120" variant="danger">
        {message}
        {errors.map((element, index) => (
          <li key={index}>{element.message}</li>
        ))}
      </Alert>
    );
  } else if ((ok===false) && message.trim() != '' && errors?.length == 0) {
    return (
      <Alert role="alert" className="alert alert-danger h-100" variant="danger">
        {message}
      </Alert>
    );
  } else {
    return (
      <Alert role="alert" className="h-100" variant="info">
        {message}
      </Alert>
    );
  }
};


function AddProduct() {
	console.log('AddProduct.js>>>[Started]');
  const { store, actions } = useContext(Context);
  console.dir(actions);


  	const formOptions = {
      productName: { required: 'Product name required.' },
      brandId:{required:'Brand is required.'}
    };  
	
    const {
		register,
		handleSubmit,
    setFocus,
   	formState: { errors,isSubmitting,isValidating },
	} = useForm();
  

    useEffect(() => {
      console.log('AddProduct.js>>>useEffect[setFocus]>>>has executed to setFocus(\'productName\')')
       setFocus('productName');
      }, [setFocus]);

      useEffect(() => {
        actions.setStore({serverSideFeedback:{ok:null,message:'',errors:[],data:[]}});
        console.log('AddProduct.js>>>useEffect[isValidating]>>>has executed to clear the feedback messages(\'\')');
      }, [isValidating ]);

    const onSubmit =async (formData)  => {
      console.log('AddProduct.js>>>onSubmit>>>Inspect the [data] variable inside the obSubmit method>>>');
      console.log(formData);
      try {
        console.dir('AddProduct.js>>>axios.post>>>[Started]');
        const response = await axios.post(
          '/api/products',
          JSON.stringify({
            productName: formData.productName,
            brandId: formData.brandId
          }),
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );
        console.dir('AddProduct.js>>>axios.post>>>[Finished]');
        console.dir(
          `Inspect the [response.data] object produced by axios.post to create a product record`
        );
        console.dir(response.data);
        const { ok, message, data, errors = [] } = response.data;
        localStorage.setItem(
          'serverSideFeedback',
          JSON.stringify({ ok, message, errors })
        );
        localStorage.setItem(
          'product',
          JSON.stringify({
            productId: data.productId,
            productName: data.productName,
            brandId: data.brandId,
            createdAt: data.createdAt,
            updatedAt:data.updatedAt
            /* I did not write additional SQL logic at the backend to return the brand name strind data. 
            The product table has only brand_id. Therefore, the following is commented out. */
            //brandName: data.brandName  
          })
        );
        actions.setStore({ serverSideFeedback: response.data });
        
        actions.setStore({
          product: {/**not done */
          productId: data.productId,
          productName: data.productName,
          brandId: data.brandId,
          brandName: data.brandName
          },
        });
        console.dir('AddProduct.js>>>onSubmit>>>[try block]>>>[Finished]');
      } catch (error) {
        console.log('AddProduct.js>>>onSubmit>>>[catch block]>>>[Executed!!]>>>Inspect [error] variable>>>');
        console.dir(error);
        console.log('AddProduct.js>>>onSubmit>>>axios post>>Failed!!!');
        console.log('AddProduct.js>>>Inspect [error.response.data] inside the catch block.>>>');
        console.dir(error.response.data);
        console.log(
          `AddProduct.js>>>onSubmit>>>serverSideFeedback at context and local storage `,
          `is updated with error.response.data`
        );
        localStorage.setItem(
          'serverSideFeedback',
          JSON.stringify(error.response.data)
        );
        actions.setStore({ serverSideFeedback: error.response.data });
      }
    };
      //End of onSubmit 
      //(which is used inside  <form onSubmit={handleSubmit(handleSubmitForm)}>)

     

      return (
        <div className="container-fluid h-100 d-flex flex-column">
        <div className="row border border-secondary  p-1 m-1">
          <div className="col-sm-2"></div>
          <div className="col-sm-8 p-1 m-1 text-start border">
              <h3 className="">Add product</h3>
          </div>
          <div className="col-sm-2"></div>		
        </div>
        <div className="row border border-secondary  p-1 m-1" style={{height: '160px',padding:'20px'}}>
          <div className="col-sm-2"></div>
          <div className="col-sm-8 p-0 m-1 text-start border h-100 p-0"  >
          <Feedback serverSideFeedback={store.serverSideFeedback}/>
          </div>
          <div className="col-sm-2"></div>		
        </div>
      
        <div className="row border border-secondary  p-1 m-1">
        <div className="col-sm-2"></div>
    <div className="col-sm-8 align-item-center p-2" >
      <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group row justify-content-center">
                  <label  className="col-sm-2 col-form-label text-end" htmlFor="brandName">Product name</label>
                                <div className="col-sm-6 text-start">                         
                  <input
                    type="text"
                    autoComplete="off"
                    className="form-control form-control-sm"
                    {...register('productName', formOptions.productName)}
                  />
                  <small className="m-2 text-danger">
                                    {/** https://youtu.be/FY8sXCsjvf8?t=1021  */}
                    {errors?.productName && errors.productName.message}
                  </small>
                                </div>   
                </div>
                <div className="form-group row justify-content-center">
                                {/*https://getbootstrap.com/docs/5.0/utilities/text/ */}
                  <label className="col-sm-2 col-form-label text-end" htmlFor="brandId">Brand</label>
                                <div className="col-sm-6 text-start">
                  <input
                    className="form-control form-control"
                    type="text"
                    {...register('brandId', formOptions.brandId)}
                  />
                                
                  <small className="m-2 text-danger">
                    {errors?.brandId && errors.brandId.message}
                  </small>
                                </div>
                </div>
                <div className="d-flex flex-row-reverse">
                  <button className="btn btn-primary mt-1" disabled={isSubmitting}>Submit</button>
                  &nbsp;
                  <Link className='btn btn-primary mt-1 p-2 d-block' to='/brands'>
                    Back to Manage products
                  </Link>
                </div>
              </form>
          
              </div>
              <div className="col-sm-2"></div>
    </div>
    </div>
    
      )
}

export default AddProduct