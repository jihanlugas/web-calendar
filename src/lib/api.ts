import axios from 'axios';
import { convertJsonData, toObjectKeyValue } from '@/utils/helper';
import Router from 'next/router';
import { isEmptyObject } from '@/utils/validate';
import https from 'https';


axios.defaults.withCredentials = false;

class Api {
	static getpdf = (requestPath: string, payload?: object) => {
		return Api._fetchpdf('get', requestPath, payload);
	};
	static get = (requestPath: string, payload?: object) => {
		return Api._fetch('get', requestPath, payload);
	};

	static post = (requestPath: string, payload?: object) => {
		return Api._fetch('post', requestPath, payload);
	};

	static put = (requestPath: string, payload?: object) => {
		return Api._fetch('put', requestPath, payload);
	};

	static delete = (requestPath: string, payload?: object) => {
		return Api._fetch('delete', requestPath, payload);
	};

	static postimage = (requestPath: string, payload?: object) => {
		const token = localStorage.getItem('token')
		const transformHeaders = {
			'Accept': 'application/json',
			'Content-Type': 'multipart/form-data',
			'Authorization': 'Bearer ' + token,
		};

		return Api._fetch('post', requestPath, payload, transformHeaders);
	};

	static putimage = (requestPath: string, payload?: object) => {
		const token = localStorage.getItem('token')
		const transformHeaders = {
			'Accept': 'application/json',
			'Content-Type': 'multipart/form-data',
			'Authorization': 'Bearer ' + token,
		};

		return Api._fetch('put', requestPath, payload, transformHeaders);
	};

	static _fetch = (method, requestPath, payload = {}, transformHeaders?: object) => {
		let token = '';
		const dataKey = (method === 'get') ? 'params' : 'data';
		const url = encodeURI(process.env.API_END_POINT + requestPath);
		if (typeof window !== 'undefined') {
			token = localStorage.getItem('token')
		}
		const headers = isEmptyObject(transformHeaders) ? {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token,
		} : transformHeaders;

		const request = axios.request({
			httpsAgent: new https.Agent({
				rejectUnauthorized: false,
			}),
			url: url,
			method: method,
			headers: headers,
			[dataKey]: payload,
			timeout: 20000,
			responseType: 'json',
		}).then(res => convertJsonData(res.data))
			.catch(error => {

				// console.log("headers ", headers);
				// console.log("url ", url);
				// if (error.response) {
				// 	console.log("data ", error.response.data,);
				// 	console.log("status ", error.response.status,);
				// 	console.log("headers ", error.response.headers,);
				// }
				// if (error.request) {
				// 	// console.log("request ", error.request,);
				// 	// console.log("_response ", error.request._response,);
				// }
				// console.log('Error', error.message);
				// // console.log(error.config);

				// handle error forceLogout
				if (error.response && error.response.data) {
					const { payload } = error.response.data;
					if (payload && payload.forceLogout) {
						localStorage.clear();
						Router.push({
							pathname: '/sign-in',
							// query: {
							// 	redirect: Router.asPath && Router.asPath,
							// }
						});
					}
				}

				if (error.response) {
					if (error.response.data) {
						const result = error.response.data;
						if (!result.status) {
							// transform response to formik setError format
							if (result.payload?.listError) {
								result.payload.listError = toObjectKeyValue(Object.values(result.payload.listError), 'field', 'msg');
							}
							
							if (!result.message) {
								result.message = error.message
							}
							return result;
						}
					}
				}

				return {
					status: false,
					message: 'Please Check Your Connection',
					payload: {}
				};
			});
		return request;
	};

	static _fetchpdf = (method, requestPath, payload = {}, transformHeaders?: object) => {
		let token = '';
		const dataKey = (method === 'get') ? 'params' : 'data';
		const url = encodeURI(process.env.API_END_POINT + requestPath);
		if (typeof window !== 'undefined') {
			token = localStorage.getItem('token')
		}
		const headers = isEmptyObject(transformHeaders) ? {
			// 'Accept': 'application/json',
			'Content-Type': 'application/pdf',
			'Authorization': 'Bearer ' + token,
		} : transformHeaders;

		const request = axios.request({
			httpsAgent: new https.Agent({
				rejectUnauthorized: false,
			}),
			url: url,
			method: method,
			headers: headers,
			[dataKey]: payload,
			timeout: 20000,
			responseType: 'blob',
		}).then(res => {
			// Extract filename from headers
			const contentDisposition = res.headers['content-disposition'];
			let filename = 'downloaded-file.pdf'; // Fallback filename

			if (contentDisposition) {
				const match = contentDisposition.split("filename=");
				if (match && match[1]) {
					filename = match[1];
				}
			}
	
			// Create a Blob from the response data
			const blob = new Blob([res.data], { type: 'application/pdf' });
	
			// Generate a URL for the Blob
			const url = window.URL.createObjectURL(blob);
	
			// Create a temporary link element
			const link = document.createElement('a');
			link.href = url;
			link.download = filename; // Use the extracted filename
	
			// Append link to the DOM, trigger click, and remove it
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
	
			// Clean up the Blob URL
			window.URL.revokeObjectURL(url);
		});
		return request;
	};
}

export { Api };