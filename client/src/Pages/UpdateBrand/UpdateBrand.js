import {useEffect, useContext } from 'react';
import styles  from  './UpdateBrand.module.css';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-bootstrap';
import { Context } from '../../Context/appContext';
import { Link,useParams } from 'react-router-dom';
import H from '../../Helpers/Helper';
const Feedback = ({ serverSideFeedback }) => {
	const { ok, errors, message } = serverSideFeedback;
	console.log(
		'UpdateBrand.js>>>Feedback function>>>[Started]>>>check the three inputs'
	);
	console.log(ok);
	console.log(message);
	console.dir(errors);
	if (ok) {
		return (
			<Alert role="alert" className="alert alert-success h-100" variant="success">
				{message}
			</Alert>
		);
	} else if (!ok && message.trim() != "" && errors?.length > 0) {
		return (
			<Alert role="alert" className="alert alert-danger h-100" variant="danger">
				{message}
				{errors.map((element, index) => (
					<p key={index}>{element.message}</p>
				))}
			</Alert>
		);
	} else if (!ok && message.trim() != "" && errors?.length == 0) {
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

function UpdateBrand() {
    const { store, actions } = useContext(Context);
	const params = useParams();
	
	//------------------------------------------------------------------------------------------------------------------------
	//useEffect which will get the getOneBrand to execute just once.
	//------------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
       console.log(`UpdateBrand.js>>>useEffect[]>>>[started]>>>calling actions.getOneBrand()`);		
	   console.log('UpdateBrand.js>>>useEffect[]>>>Inspect params.brandId');
	   console.log('params.brandId>>>', params.brandId);		    
       actions.getOneBrand({brandIdForSearch:params.brandId});
       console.log(`UpdateBrand.js>>>useEffect[]>>>[finished]>>>calling actions.getOneBrand()`);			
       console.log(`The useEffect[store.brand] logic should begin once the store.brand has been updated.`);			
    }, []);
	//------------------------------------------------------------------------------------------------------------------------
	//useEffect which will keep an eye on the store.brand so that setValue is used to 
	//populate the form input controls with the record details.
	//------------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
		console.log(`UpdateBrand.js>>>useEffect[store.brand]>>>[started]>>>Update the form inputs through setValue`);		
		setValue('brandId',store.brand.brandId);
		setValue('brandName',store.brand.brandName);
		setValue('brandUrl',store.brand.brandUrl);
		console.log(`UpdateBrand.js>>>useEffect[store.brand]>>>[finished]>>>Update the form inputs through setValue`);		
	}, [store.brand]);

	//------------------------------------------------------------------------------------------------------------------------
	//Setup the formOptions which is going to be used as an input when you call the useForm
	//. The useForm hook's internal logic will analyze the formOptions data to keep an eye on the
	//respective form input controls.
	//------------------------------------------------------------------------------------------------------------------------
	const formOptions = {
		brandName: { required: 'Brand name is required' },
		brandUrl: {
			required: 'Brand URL is required',
			validate:{
				value: (value)=>{return H.validateUrl(value)?true:'URL requires valid URL format'},
			}
		},
    defaultValues:store.brand,/*Need this to initialize the form Reference:https://react-hook-form.com/api/useform*/
	};

	const {
		register,
		handleSubmit,
		setFocus,
		setValue,
		getValues,
    reset,
		formState: { errors, isValidating,isSubmitting },
	} = useForm(formOptions);

	//------------------------------------------------------------------------------------------------------------------------
	//Form related useEffect [start]  (Programming note: setup the useEffects here after you have called useForm)
	//------------------------------------------------------------------------------------------------------------------------
	useEffect(() => {
		console.log('UpdateBrand.js>>>useEffect[setFocus]>>>has executed to setFocus(\'brandName\')');
		setFocus('brandName');
		console.log('UpdateBrand.js>>>useEffect[setFocus]>>>has executed to setFocus(\'brandName\')>>>[Finished]');
	}, [setFocus]);

	useEffect(() => {
		console.dir('UpdateBrand.js>>>useEffect[isValidating]>>>call actions.clearServerSideFeedback');
		actions.clearServerSideFeedback();
		console.log('UpdateBrand.js>>>useEffect[isValidating]>>>has executed to clear store.serverSideFeedback>>>[Finished]');
	}, [isValidating]);
	//------------------------------------------------------------------------------------------------------------------------
    //Form related useEffect [end]
	//------------------------------------------------------------------------------------------------------------------------

	const onSubmit = async (data) => {
		try {
			console.log('UpdateBrand.js>>>onSubmit>>>[Started]');
			console.log('UpdateBrand.js>>>onSubmit>>>Check whether react-form-hook got keep track of the record id.');
			console.log('UpdateBrand.js>>>onSubmit>>>Inspect the [data] variable -- input parameter of the onSubmit');
			console.dir(data);
			await actions.updateBrand({brandId:data.brandId,brandName:data.brandName,brandUrl:data.brandUrl});
			console.log('UpdateBrand.js>>>onSubmit>>> using the actions.updateBrand() command>>> [Finished]');
		} catch (error) {
			console.log('UpdateBrand.js>>>onSubmit method [catch block]>>>[Executed!!!]');
            console.log('I don\'t know what to write in this [catch block]. Inspect the [error] variable');
			console.dir(error);
			console.log('UpdateBrand.js>>>onSubmit method [catch block]>>>[Finished!!!]');
		}
	};

	return (
		<div className="container-fluid h-100 d-flex flex-column">
		<div className="row border border-secondary  p-1 m-1">
			<div className="col-sm-2"></div>
			<div className="col-sm-8 p-1 m-1 text-start border">
					<h3 className="">Update brand</h3>
			</div>
			<div className="col-sm-2"></div>		
		</div>
		<div className="row border border-secondary  p-1 m-1" style={{height: '160px',padding:'20px'}}>
			<div className="col-sm-2"></div>
			<div className="col-sm-8  m-1 text-start border p-0"  >
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
								name="brandName"
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
								name="brandUrl"
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

export default UpdateBrand;
