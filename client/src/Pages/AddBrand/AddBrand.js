import React,{useState, useEffect, useContext } from 'react';
import styles  from  './AddBrand.module.css';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-bootstrap';
import { Context } from '../../Context/appContext';
import { Link } from 'react-router-dom';
import H from '../../Helpers/Helper';

const Feedback = ({serverSideFeedback})=>{
    const {ok,errors,message}=serverSideFeedback;
    console.log('AddBrand.js>>>Feedback>>>Check the three inputs:');
    console.log(ok);
    console.log('The ok input parameter should have either, null, true or false. As a result, you need to be careful with the conditional statement.');
    console.log((ok==null)?'The ok input is null. Therefore the the else block should execute. ':'The ok input is not null, something should be displayed.');
    console.log(message?message:'The message variable is empty string');
    console.dir(errors?errors:'The errors is null.');
    if (ok==true) {
      return (
        <Alert role="alert" className="alert alert-success h-100" variant="success">
          {message}
        </Alert>
      );
    } else if ((ok==false) && message.trim() != '' && errors?.length > 0) {
      return (
        <Alert role="alert" className="alert alert-danger h-100" variant="danger">
          {message}
          {errors.map((element, index) => (
            <p key={index}>{element.message}</p>
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
function AddBrand() {
    const { store, actions } = useContext(Context);
	console.log('AddBrand.js>>>[Started]');
	const formOptions = {
		brandName: { required: 'Brand name is required' },
		brandUrl: {
			required: 'Brand URL is required',
			validate:{
				value: (value)=>{return H.validateUrl(value)?true:'URL requires valid URL format'},
			}
		},
	};
	const {
		register,
		handleSubmit,
		setFocus,
		formState: { errors, isValidating,isSubmitting },
	} = useForm(formOptions);

	useEffect(() => {
		console.log('AddBrand.js>>>useEffect[setFocus]>>>has executed to setFocus(\'brandName\')');
		setFocus('brandName');
	}, [setFocus]);
	//If change the following useEffect dependency to isSubmitting. Things are going to be bad.
	useEffect(() => {
		console.dir('>>>AddBrand.js>>>useEffect[isValidating]>>>Call the actions.clearServerFeedback>>>[Started]'	);
		actions.clearServerSideFeedback();
		console.log(
			'AddBrand.js>>>useEffect[isValidating]>>>Has executed to clear store.serverSideFeedback');
	}, [isValidating]);

	const onSubmit = async (formData) => {
		try {
			console.log('AddBrand.js>>>onSubmit>>>Inspect [formData] variable>>>');
			console.dir(formData);
			await actions.addBrand({brandName:formData.brandName,brandUrl:formData.brandUrl});
			console.log('HTTP request for add brand has been successful inside the try block.');
		} catch (error) {
			console.log('AddBrand.js>>>onSubmit method [catch] block>>>[Started!!!!]');
            console.log('I don\'t know what to write in this [catch] block. Inspect the [error] object>>>');
			console.dir(error);
		}
	};

	return (
		<div className="container-fluid h-100 d-flex flex-column">
		<div className="row border border-secondary  p-1 m-1">
			<div className="col-sm-2"></div>
			<div className="col-sm-8 p-1 m-1 text-start border">
					<h3 className="">Add brand</h3>
			</div>
			<div className="col-sm-2"></div>		
		</div>
		<div className="row border border-secondary  p-1 m-1" style={{height: '160px',padding:'20px'}}>
			<div className="col-sm-2"></div>
			<div className="col-sm-8 m-1 text-start border h-100 p-0" >
			<Feedback serverSideFeedback={store.serverSideFeedback}/>
			</div>
			<div className="col-sm-2"></div>		
		</div>
	
		<div className="row border border-secondary  p-1 m-1">
		<div className="col-sm-2"></div>
<div className="col-sm-8 align-item-center p-2" >
	<form onSubmit={handleSubmit(onSubmit)}>
						<div className="form-group row justify-content-center">
							<label  className="col-sm-2 col-form-label text-end" htmlFor="brandName">Brand name</label>
                            <div className="col-sm-6 text-start">                         
							<input
								type="text"
								autoComplete="off"
								className="form-control form-control-sm"
								{...register('brandName', formOptions.brandName)}
							/>
							<small className="m-2 text-danger">
                                {/** https://youtu.be/FY8sXCsjvf8?t=1021  */}
								{errors?.brandName && errors.brandName.message}
							</small>
                            </div>   
						</div>
						<div className="form-group row justify-content-center">
                            {/*https://getbootstrap.com/docs/5.0/utilities/text/ */}
							<label className="col-sm-2 col-form-label text-end" htmlFor="brandUrl">Brand URL</label>
                            <div className="col-sm-6 text-start">
							<input
								className="form-control form-control"
								type="text"
								{...register('brandUrl', formOptions.brandUrl)}
							/>
                            
							<small className="m-2 text-danger">
								{errors?.brandUrl && errors.brandUrl.message}
							</small>
                            </div>
						</div>
						<div className="d-flex flex-row-reverse">
							<button className="btn btn-primary mt-1" disabled={isSubmitting}>Submit</button>
							&nbsp;
							<Link className='btn btn-primary mt-1 p-2 d-block' to='/brands'>
								Back to Manage brands
							</Link>
						</div>
					</form>
			
					</div>
					<div className="col-sm-2"></div>
</div>
</div>
	);
}

export default AddBrand;
