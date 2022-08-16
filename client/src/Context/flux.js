import axios from 'axios';
const baseUrl = '';

const convertUtcToLocal=(input)=>{
	return new Date(input).toLocaleString();
}  


const getState = ({ getStore, setStore, getActions }) => {
	return {
		store: {
			brands: localStorage.getItem('brands')
				? JSON.parse(localStorage.getItem('brands'))
				: [],
			brand: localStorage.getItem('brand')
				? JSON.parse(localStorage.getItem('brand'))
				: { brandId: 0, brandName: '', brandUrl: '' },
			serverSideFeedback: { ok: null, message: '', errors: [], data: [] },
			products: [],
			product: { productId: 0, productName: '', brandId: 0, brandName: '' },
		},
		actions: {
			setStore:(object)=>{
				setStore(object);
			},

			clearServerSideFeedback: () => {
				console.log('clearServerSideFeedback>>>[Start]>>clear the localStorage \n', 
				'which has serverSideFeedback and reset the store.serverSideFeedback');
				localStorage.setItem('serverSideFeedback', JSON.stringify({ ok: null, message: '', errors: [], data: [] }));
				setStore({serverSideFeedback: { ok: null, message: '', errors: [], data: [] },
				});
			},

			getOneBrand: async ({ brandIdForSearch }) => {
				//For this project, I have set an assumption (fictitious assumption) that
				//the brand data in the client-side context cannot be treated as "most current"
				//because someone else might have modified the brand record at the backend
				//database. As a result, getOneBrand logic won't obtain the brand data from
				//the brands store in the context. The logic makes a GET method HTTP request
				//to fetch a fresh brand record from the backend.
				try {
					console.dir('flux.js>>>getOneBrand>>>[try block]>>>[started]');
					console.dir(brandIdForSearch);
					const response = await axios.get(baseUrl + '/api/brands/' + brandIdForSearch, {
						headers: { 'Content-Type': 'application/json' },
						withCredentials: true,
					});
					console.dir('flux.js>>>getOneBrand>>>Inspect [response.data.data]>>>');
					console.dir(response?.data?.data);

					//I copied the code from getBrands
					//I did not modify the code much, because I know I need to build
					//a single object
					const { brandId, brandName, brandUrl } = response.data.data;
					//Update the localStorage (brand) first before updating the store
					localStorage.setItem(
						'brand',
						JSON.stringify({
							brandId: brandId,
							brandName: brandName,
							brandUrl: brandUrl,
						})
					);
					setStore({ brand: { brandId, brandName, brandUrl } });

					console.dir('flux.js>>>getOneBrand>>>[try block]>>>[finished]');
				} catch (error) {
					console.dir('flux.js>>>getOneBrand>>>[catch block]>>>[Executed!!]');
					console.dir('flux.js>>>getOneBrand>>>Inspect [error.data.data] variable>>>');
					console.dir(error.data.data);
					console.dir('flux.js>>>getOneBrand>>>[catch block]>>>[finished]');
					console.log(
						'flux.js>>>getOneBrand>>>serverSideFeedback state is updated with error.response.data'
					);
					localStorage.setItem(
						'serverSideFeedback',
						JSON.stringify(error.response.data)
					);
					setStore({ serverSideFeedback: error.response.data });
				}
			}, //getOneBrand
			getBrands: async () => {

				
				try {
					console.dir('flux.js>>>getBrands>>>[try block]>>>[started]');
					const response = await axios.get(baseUrl + '/api/brands', {
						headers: { 'Content-Type': 'application/json' },
						withCredentials: true,
					});
					console.dir('flux.js>>>getBrands>>>Inspect [response.data.data]>>>');
					console.dir(response.data.data);
					let dataArray = [];
					response.data.data &&
						response.data.data.forEach((brand) => {
							dataArray.push({
								brandId: brand.brandId,
								brandName: brand.brandName,
								brandUrl: brand.brandUrl,
							});
						});
					//Update the store
					localStorage.setItem('brands', JSON.stringify(dataArray));
					setStore({ brands: dataArray });
					const { ok, message, data, errors = [] } = response.data;
					setStore({ serverSideFeedback: { ok, message, errors } });
					console.dir({ ok, message, data, errors })
					console.dir('flux.js>>>getBrands>>>[try block]>>>[finished]');
					console.dir(`flux.js>>>getBrands>>>[try block]>>>
                    setStore was called to update the brands in the store.`);
				} catch (error) {
					console.dir('flux.js>>>getBrands>>>[catch block]>>>[executed!!]');
					console.dir('flux.js>>>getBrands>>>Inspect the [error] variable>>>[started]');
					console.dir(error);
					console.dir('flux.js>>>getBrands>>>Inspect the [error] variable>>>[finished]');
					console.log(
						'flux.js>>>getBrands>>>serverSideFeedback state is updated with error.response.data'
					);
						localStorage.setItem(
						'serverSideFeedback',
						JSON.stringify(error.response.data)
					);
					setStore({ serverSideFeedback: error.response.data });
					console.dir('flux.js>>>getBrands>>>[catch block]>>>[finished]');
				}
			}, //getBrands
			addBrand: async ({ brandName, brandUrl }) => {
				console.dir('flux.js>>>addBrand>>>[started]');
				try {
					console.dir('flux.js>>>addBrand>>>[try block]>>>[started]');
					console.dir('flux.js>>>addBrand>>>[try block]>>>axios.post>>>[started]');
					console.dir('flux.js>>>addBrand>>>[try block]>>>axios.post>>>Sending data to backend');
					const response = await axios.post(
						baseUrl + '/api/brands',
						JSON.stringify({
							brandName: brandName,
							brandUrl: brandUrl,
						}),
						{
							headers: { 'Content-Type': 'application/json' },
							withCredentials: true,
						}
					);
					console.dir('flux.js>>>addBrand>>>[try block]>>>axios.post>>>[finished]');
					console.dir(`Inspect the [response.data] object after axios.post to create a brand record`);
					console.dir(response.data);
					console.dir(`flux.js>>>addBrand>>>Using [response.data] to save to context and local storage>>>[started]`);
					const { ok, message, data, errors = [] } = response.data;
					localStorage.setItem(
						'serverSideFeedback',
						JSON.stringify({ ok, message, errors })
					);
					localStorage.setItem(
						'brand',
						JSON.stringify({
							brandId: data.brandId,
							brandName: data.brandName,
							brandUrl: data.brandUrl,
						})
					);
					setStore({ serverSideFeedback: response.data });
					setStore({
						brand: {
							brandId: data.brandId,
							brandName: data.brandName,
							brandUrl: data.brandUrl,
						},
					});
					console.dir(`flux.js>>>addBrand>>>Using [response.data] to save to context and local storage>>>[finished]`);
					console.dir('flux.js>>>addBrand>>>[try block]>>>[finished]');
				} catch (error) {
					console.log('flux.js>>>addBrand>>>[catch block]>>>[Executed!!]');
					console.log('flux.js>>>addBrand>>>axios post [Failed!!!]');
					console.dir(error.response.data);
					console.log(`flux.js>>>addBrand>>>serverSideFeedback inside the local storage>>>`);
					console.log(`is updated with [error.response.data]`	);
					localStorage.setItem(
						'serverSideFeedback',
						JSON.stringify(error.response.data)
					);
					console.log(`flux.js>>>addBrand>>>serverSideFeedback inside the context is updated with error.response.data`	);
					setStore({ serverSideFeedback: error.response.data });
				}
			}, //End of addBrand
			updateBrand: async ({ brandId, brandName, brandUrl }) => {
				try {
					console.dir('flux.js>>>updateBrand>>>[try block]>>>axios.put>>>[started]');
					//https://javascript.plainenglish.io/react-tips-async-and-setstate-cb539ad62135
					//setStore({ serverSideFeedback: null });
					//Should not do the above command inside the updateBrand method because setStore is async
					//The original intension was to reset the serverSideFeedback inside the store so that
					//any feedback messages in the Update, Add or Manage brand views are reset.
					//Unfortunately the idea of using the above statement (commented out), is not appropriate.
					//https://levelup.gitconnected.com/react-hooks-gotchas-setstate-in-async-effects-d2fd84b02305
					const response = await axios.put(
						baseUrl + "/api/brands/" + brandId,
						JSON.stringify({
							brandId: brandId,
							brandName: brandName,
							brandUrl: brandUrl,
						}),
						{
							headers: { 'Content-Type': 'application/json' },
							withCredentials: true,
						}
					);
					console.dir('flux.js>>>updateBrand>>>[try block]>>>axios.put>>>[finished]');
					console.dir(`Inspect the [response.data] object produced by axios.put which\n asked the backend to update a brand record`);
					console.dir(response.data);
					//https://stackoverflow.com/questions/58587779/react-hook-replacing-old-state
					//You don't need to worry about the impact on how the state content changes because
					//you are "replacing everying" with a new object.

					//Update local storage first
					console.dir(`flux.js>>>updateBrand>>>use [response.data] object to update serverSideFeedback and brand local storage.`);
					const { ok, message, data, errors = [] } = response.data;
					localStorage.setItem(
						'serverSideFeedback',
						JSON.stringify({ ok, message, errors })
					);
					localStorage.setItem(
						'brand',
						JSON.stringify({
							brandId: data.brandId,
							brandName: data.brandName,
							brandUrl: data.brandUrl,
						})
					);
					//Update the state
					console.dir(`flux.js>>>updateBrand>>>use [response.data] object to update serverSideFeedback and brand living inside the context.`);
					setStore({ serverSideFeedback: response.data });
					setStore({
						brand: {
							brandId: data.brandId,
							brandName: data.brandName,
							brandUrl: data.brandUrl,
						},
					});
					console.dir(`flux.js>>>updateBrand>>>[try block]>>>[finished]`);
	
				} catch (error) {
					console.log('flux.js>>>updateBrand>>>[catch block]>>>[executed!!]');
					console.log('flux.js>>>updateBrand>>>axios put has failed!!!>>>Inspect the [error.response.data]>>>[started]');
					console.dir(error.response.data);
					console.log('flux.js>>>updateBrand>>>serverSideFeedback at context  and localStorage with [error.response.data]>>[started]'	);
					localStorage.setItem('serverSideFeedback',JSON.stringify(error.response.data));
					setStore({ serverSideFeedback: error.response.data });
					console.log('flux.js>>>updateBrand>>>serverSideFeedback at context  and localStorage with [error.response.data]>>[finished]');
				}
			}, //End of updateBrand

			deleteBrand: async ({ brandId }) => {
				try {
					//brandId=200;/*Purposely replaced the brandId parameter variable */
					//value with 200 to simulate deleting ghost record.
					console.log('flux.js>>>deleteBrad>>>');
					console.log('There are two silent communications : (1)Delete one brand and (2) retrieve all brands.');
					console.log('flux.js >>>deleteBrand>>>Check the brandId input :  [',brandId ,']');
					const response = await axios.delete(baseUrl + '/api/brands/' + brandId, {
						headers: { 'Content-Type': 'application/json' },
						withCredentials: true,
					});
					console.dir('flux.js>>>deleteBrand>>>Inspect the [response.data] object (produced by axios.delete(...)).');
					console.dir(response?.data?response?.data:'[response.data] is empty');
					console.log('flux.js>>>deleteBrand>>>serverSideFeedback at context and localStorage are updated with [response.data]>>>[started]');
					//Update localStorage first
					localStorage.setItem('serverSideFeedback', JSON.stringify(response.data));
					//Update the state
					setStore({ serverSideFeedback: response.data });
					console.dir('flux.js>>>deleteBrand>>>');
					console.dir('Retrieving fresh list of brand records from the backend by ');
					console.dir('calling getActions().getBrands() after the delete logic operation has finished.');
					getActions().getBrands();
					localStorage.setItem('serverSideFeedback', JSON.stringify(response.data));
					setStore({ serverSideFeedback: response.data });
					console.log('flux.js>>>deleteBrand>>>serverSideFeedback at context and localStorage are updated with [response.data]>>>[started]');
				} catch (error) {
					console.log('flux.js>>>deleteBrand>>>[catch block]>>>[executed!!].');
					console.log('flux.js>>>deleteBrand>>>axios.delete>>>[failed!!!]');
					console.log('flux.js>>>deleteBrand>>>Inspect the [error.response.data]');
					console.dir(error.response.data);
					console.log('flux.js>>>deleteBrand>>>serverSideFeedback at context and localStorage are updated with [error.response.data]>>>[started]');
					localStorage.setItem(
						'serverSideFeedback',
						JSON.stringify(error.response.data)
					);
					setStore({ serverSideFeedback: error.response.data });
					console.log('flux.js>>>deleteBrand>>>serverSideFeedback at context and localStorage are updated with [error.response.data]>>>[Ended]');
				}
			}, //End of deleteBrand
		},
	};
};

export default getState;
