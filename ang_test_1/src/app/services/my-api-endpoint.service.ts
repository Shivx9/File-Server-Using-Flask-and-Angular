import { Injectable } from '@angular/core';
import fetch, { Body } from "node-fetch";
import { ActivatedRoute, Router } from '@angular/router';

import * as Globals from './../Globals'
import { CoreFuncModule } from '../modules/core-func/core-func.module';
import { Observable, catchError, throwError } from 'rxjs';
import { Item } from '../interfaces/interfaces';
import { HttpClient, HttpHeaders, HttpRequest, withInterceptors } from '@angular/common/http';



@Injectable()

export class MyApiEndpointService {

	constructor(private router:Router, private http:HttpClient, private currRoute:ActivatedRoute) { }

	

  	get_auth_header(){
		return	`Bearer ${localStorage.getItem(Globals.token_dentifier)}`
	}

	
	objToForm(data:object):any{
		let form = new FormData()
		Object.entries(data).forEach(([k, v]) => {
			form.append(k, v);
		  })
		
		return form
	}


	goToDefaultPage(){
		this.router.navigateByUrl(Globals.postLoginPage)
	}

	sendLogin(details:any):Observable<any>
	{
		let f = new FormData()
		for(let i of ['email', 'password']){
			f.append(i, details[i])
		}

		return this.http.post(Globals.base_api_url+'/login' , f)
		.pipe(
			catchError((error)=>{
				console.log(error)
				throw new Error("Login error - " + error)
			})
		)
		

	}


	logout(){
		this.http.get(Globals.base_api_url + '/logout')
		.subscribe(()=>{
			localStorage.removeItem(Globals.token_dentifier)
			this.router.navigateByUrl('/login')
		})
		
	}


	sendReg(details:any){
		fetch(Globals.base_api_url+'/register',
			{
				method:'POST',
				body: this.objToForm(details)
			}
		)
		.then((res)=> {return(res.json())})
		.then((data)=> alert(data['msg']))
		.catch((error)=> alert("Error encountered : "+ error))
	}


	async verifyReg(key: any): Promise<boolean> {
		console.log("Token received as ", key);
		try {
		  const response = await fetch(Globals.base_api_url + '/verify/reg/' + key, {
			method: 'GET',
		  });
		  if (response.ok) {
			console.log("Done");
			return true;
		  } else {
			throw new Error("API request failed");
		  }
		} catch (error) {
		  alert("Error encountered - check your link and try again\n" + error);
		  return false;
		}
	}


	passReset(newPass:string, key:string):Observable<any>{
		let f = new FormData
		f.append('password', newPass)

		return this.http.post(
				Globals.base_api_url+'/verify/pass/' + key,
				f
			)
			.pipe(
				catchError(
					(error)=>{
						console.log(error)
						throw new Error("API req for domain sessions failed : " + error)
					}
				)
			)
	}		
	
	requestPassResetLink(email:string):Observable<any>{
		let f = new FormData
		f.append('email', email)

		return this.http.post(
			Globals.base_api_url+'/sendreset',
			f
		)
		.pipe(
			catchError(
				(error)=>{
					console.log(error)
					throw new Error("API req for domain sessions failed : " + error)
				}
			)
		)
	}


	loadDomainSessionList():Observable<any>{

		return this.http.get(Globals.base_api_url, {
		})
		.pipe(
			catchError((error)=>{
				console.log(error)
				throw new Error("API req for domain sessions failed : " + error)
			})
		)
		

	}

	explore(domainID:any, path:string):Observable<any>{
		

		return this.http.get(Globals.base_api_url + '/explore/' + domainID.toString() + '?dir=' + path,  {
		})
		.pipe(
			catchError((error)=>{
				console.log(error)
				throw new Error("API req for directory failed : " + JSON.stringify(error))
			})
		)
		

	}
	


	downloadFromDirectory(domainID:string | number, path:string) // single file
	{

		return this.http.get(Globals.base_api_url + '/explore/' + domainID.toString() + '?dir=' + path,
		{
			responseType:'blob'

		}).pipe(
			catchError((err)=>{
				throw new Error("error while retrieving file\n" + err)
			})
		)
	}

	downloadMultiFromDirectory(domainID:any, path:string, filePaths:string[]){
		let f = new FormData
		f.append('to_retrieve', JSON.stringify(filePaths))

		return this.http.patch(
			
			Globals.base_api_url + '/explore/' + domainID.toString() + '?dir=' + path,
			f,
			{
				responseType:'blob'
			}
		).pipe(
			catchError((err)=>{
				throw new Error("error while retrieving file\n" + err)
			}))
	}


	addToDirectory(domainID:number | string, path:string, type:string, data:any):Observable<any>
	{
		
		let f = new FormData()

		f.append('type',type)

		if(type=='upload'){
			for(let file of data){
				f.append('toUpload', file)
			}
		}
		else if (type=='create'){
			f.append('target', data)
		}

		return this.http.post(
						Globals.base_api_url + '/explore/' + domainID.toString() + '?dir=' + path,
						f)
				.pipe(
					catchError((err)=>{
						throw new Error("error while retrieving file\n" + err)
					}))
					
	}

	modifyInDirectory(domainID:number, path:string, type:'rename' | 'relocate', data:any):Observable<any>
	{
		let f = new FormData()

		f.append('type',type)

		if(type=='rename'){
			for(let i of ['target', 'targetPath'])
			{
				f.append(i, data[i])
			}
		}

		else if (type=='relocate'){
			for(let i of ['initPath', 'finalPath','duplicate'])
			{
				f.append(i, data[i])
			}		
		}
		
		return this.http.put(
			Globals.base_api_url + '/explore/' + domainID.toString() + '?dir=' + path,
			f
		).pipe(
			catchError((err)=>{
				throw new Error("error while modifying file(s)\n" + err)
			}))

	}
	



	deleteFromDirectory(domainID:number, path:string, data:any)
	{
		let f = new FormData()

		f.append('toDelete', data['toDelete'])

		return this.http.delete(
			Globals.base_api_url + '/explore/' + domainID.toString() + '?dir=' + path,
			{
				body:f
			}
		).pipe(
			catchError((err)=>{
				throw new Error("error while deleting file(s)\n" + err)
			}))		


	}
	





}
