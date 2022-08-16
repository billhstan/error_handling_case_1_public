import React, { useState, useEffect } from 'react';
import getState from './flux.js';

// Don't change, here is where we initialize our context, by default its just going to be Null.
export const Context = React.createContext(null);

//IMPORTANT reference because I obtained most of the concepts from this author.
//https://github.com/jhcxavier/Contact_List_Medium

const injectContext = PassedComponent => {
	const StoreWrapper = props => {
		//This will be passed as the context value
		const [state, setState] = useState(
			getState({
				getStore: () => state.store,
				getActions: () => state.actions,
				setStore: updatedStore =>
					setState({
						store: Object.assign(state.store, updatedStore),
						actions: { ...state.actions }
					})
			})
		);

		useEffect(() => {
			/**
			 * EDIT THIS!
			 * This function is the equivalent to "window.onLoad", it only run once on the entire application lifetime
			 * you should do your ajax requests or fetch api requests here
			 * state.loadSomeData(); <---- calling this function from the flux.js actions
			 **/
			//state.actions.getBrands();  (Cannot call here because I end up seeing "5 records" message in the Add view interface when reload)
            state.actions.clearServerSideFeedback();
		}, []);

		// the initial value for the context its not null anymore, but the current state of this component,
		// the context will have a getStore and setStore functions available then, because they were declared
		// on the state of this component
		return (
			<Context.Provider value={state}>
				<PassedComponent {...props} />
			</Context.Provider>
		);
	};
	return StoreWrapper;
};

export default injectContext;