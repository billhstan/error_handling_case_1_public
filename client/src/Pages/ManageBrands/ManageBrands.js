import React,{ useEffect, useContext } from 'react';
import { Alert } from 'react-bootstrap';
import styles  from  './ManageBrands.module.css';
import BrandTable from '../../Components/Table/BrandTable';
import { useNavigate, Link } from "react-router-dom";
import { Context } from '../../Context/appContext';


const Feedback = ({serverSideFeedback})=>{
    const {ok,errors,message}=serverSideFeedback;
    console.log('ManageBrands.js>>>Feedback>>>Check the three inputs:');
    console.log('ok',ok);
    console.log('The ok input parameter should have either, null, true or false. As a result, you need to be careful with the conditional statement.');
    console.log((ok==null)?'The ok input is null. Therefore the the else block should execute. ':'The ok input is not null, something should be displayed.');
    console.log('message : ', message?message:'The message variable is empty string');
    console.dir('errors : ' ,errors?errors:'The errors is null.');
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

export const ManageBrands = () => {
    const { store, actions } = useContext(Context);

    const navigate = useNavigate();
       useEffect(() => {
        console.log('>>>ManageBrands.js >>>useEffect[store.brands]')
       console.log(store.brands);
    }, [store.brands]);
    useEffect(() => {
      console.log('>>>ManageBrands.js >>>useEffect[]>>>Retrieve data from backend');
			actions.getBrands();
    }, []);
    useEffect(() => {
      console.log('>>>ManageBrands.js >>>useEffect[serverSideFeedback]>>>');
        console.dir(store.serverSideFeedback);
    }, [store.serverSideFeedback]);
    const getRowProps = (row) => ({
        onClick: async () => {
          let brandId = (row.original.brandId);
          
          try {
console.dir('>>>ManageBrands.js>>>getRowProps>>>[started]>>Check row variable');
            console.dir(row);
            //await actions.deleteBrand({brandId:brandId});
             
          } catch (err) {
              console.log('>>>onSubmit method catch block>>>');
              console.log('I don\'t know what to write in this catch block.');
              console.dir(err);
          }
      },
        style: {
          cursor: 'pointer'
        }
      });//End of getRowProps
      const handleButtonClicks = async (cell) => {
        //https://github.com/TanStack/table/discussions/2295
        //You need to read a lot of discussions such as the one above to slowly appreciate the
        //cell input parameter which is defined for the handleButtonClicks.
        console.dir('ManageBrands.js>>>handleButtonClicks>>>[started]>>Check [cell.column] variable');
        console.dir(cell.column);
        console.dir('ManageBrands.js>>>handleButtonClicks>>>Check [cell.row] variable');
        console.dir(cell.row);
        console.dir('ManageBrands.js>>>handleButtonClicks>>>Check [cell.value] variable');
        console.dir(cell.value);
        console.dir('ManageBrands.js>>>handleButtonClick>>>Check the entire [cell] variable');
        console.dir(cell);
        console.dir('ManageBrands.js>>>handleButtonClick>>>Check [cel?.row?.original] variable');
        console.dir(cell?.row?.original);
        if(cell.value==='delete'){
            let brandId = cell.row.original.brandId;
            console.dir('ManageBrand.js>>>The cell.value property is \'delete\'. Calling actions.deleteBrand to begin delete brand flow.');
            await actions.deleteBrand({brandId:brandId});
        }
        if(cell.value==='update'){
            console.dir('ManageBrand.js>>>The cell.value property is \'update\'. Navigating the user to the Update Brand view.');
            let brandId = cell.row.original.brandId;
            console.log('ManageBrand.js>>>Start calling the navigate(\'/brands/' + brandId + ')>>>[started]');
            navigate('/brands/' + brandId);
            console.log('ManageBrand.js>>>Start calling the navigate(\'/brands/' + brandId + ')>>>[finihsed)');
        }
    }
    const columns = [
        {
          Header: 'Name',
          accessor: 'brandName',
          disableFilters: false,
          className: 'text-center '
        },
        {
          Header: 'Official Site',
          accessor: 'brandUrl',
          Cell: ({ cell: { value } }) =>
            value ? <a href={value}>{value}</a> : '-',
            disableFilters: false,
            className:'col-sm-4 text-start'
        },
        {
            Header: 'Delete',
            accessor: (str) => 'delete',
            Cell: props => <button className="btn btn-secondary" onClick={() => handleButtonClicks(props)}>Delete</button>,
            disableFilters: true,
            className:'col-sm-1 text-center'
      },
      {
        Header: 'Update',
        accessor: (str) => 'update',
        Cell: props => <button className="btn btn-secondary" onClick={() => handleButtonClicks(props)}>Update</button>,
        disableFilters: true,
        className:'col-sm-1 text-center'
  },
      ];
      const rowProperties = (props) => {
							/*The rowProperties method does not contribute to the main user flow logic in
            this ManageBrands.js. The method was created to investigate and familiarize with
            e and props object. The method was created to familiarize with how [row level] actions
            and customization can be achieved in future code challenges */
							return {
								onClick: (e) => {
									console.log(
										'>>>The onClick defined insde rowProperties>>>Check the e variable'
									);
									console.dir(e);
									console.log(
										'>>>The onClick defined insde rowProperties>>>Check the props variable'
									);
									console.dir(props);
								},
								style: {
									cursor: 'auto',
								},
							};
						};
    
    return (
					<div className='container-fluid h-100 border'>
						<div className='row border border-secondary  p-1 m-1'>
							<div className='col-sm-2'></div>
							<div className='col-sm-8 p-1 m-1 text-start border'>
								<h3 className=''>Manage brands</h3>
							</div>
							<div className='col-sm-2'></div>
						</div>
						<div className='row border border-secondary  p-1 m-1' style={{height: '160px',padding:'20px'}}>
							<div className='col-sm-2'></div>
							<div className='col-sm-8 p-1 m-1 text-start border h-100' >
								<Feedback serverSideFeedback={store.serverSideFeedback} />
							</div>
							<div className='col-sm-2'></div>
						</div>

						<div className='row border border-secondary  p-1 m-1'>
							<div className='col-sm-1'></div>
							<div className='col-sm-10 align-item-center p-2'>
								<div className='d-flex justify-content-end'>
									<Link to='/brands/add'>
										<button className='btn btn-primary'>Add brand</button>
									</Link>
								</div>
								<div className='d-flex justify-content-center'>
									<BrandTable columns={columns} data={store.brands} getRowProps={rowProperties} />
								</div>
							</div>
							<div className='col-sm-1'></div>
						</div>
					</div>
				);
};

export default ManageBrands;