import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DataService {


  private progressBooleanSource=new BehaviorSubject<boolean> (false);
  public progressBoolean=this.progressBooleanSource.asObservable();

  private darkskyMODALSource=new BehaviorSubject<object> ({});
  public darkskyMODAL=this.darkskyMODALSource.asObservable();

  private darkskyMODALDataSource=new BehaviorSubject<object> ({});
  public darkskyMODALData=this.darkskyMODALDataSource.asObservable();

  private favoriteArraySource=new BehaviorSubject<Array<object>> ([]);
  public favoriteArray=this.favoriteArraySource.asObservable();

  private activeTabSource=new BehaviorSubject<String> ("results");
  public activeTab=this.activeTabSource.asObservable();

  private darkskyJSONSource=new BehaviorSubject<any> ({});
  public darkskyJSON=this.darkskyJSONSource.asObservable();


  constructor(private http: HttpClient) { }



  public setProgressBoolean(temp)
  {
    this.progressBooleanSource.next(temp);
  }

  
  public setdarkskyJSON(ds)
  {
    this.darkskyJSONSource.next(ds);
  }4
  public setActiveTab(temp2)
  {
    this.activeTabSource.next(temp2);
  }

  public setItemArray(temp3)
  {
    this.favoriteArraySource.next(temp3);
  }

  public setModal(t)
  {
    this.darkskyMODALSource.next(t);
  }
  public setModalData(t2)
  {
    this.darkskyMODALDataSource.next(t2);
  }
 
  public getCustomImage(state)
  {
    var x="http://localhost:8081/imagesearch/state="+state;
    return this.http.get(x);
  }

  public getGeo(street,city,state) {

  	var streeet=encodeURI(street);
  	var cityy=encodeURI(city);

  	var y="http://localhost:8081/geolocation/street="+streeet+"&city="+cityy+"&state="+state;
    return this.http.get(y);
  }
 
  public getJSON(lat,lon)
  {
    var z="http://localhost:8081/darksky/latitude="+lat+"&longitude="+lon;
    return this.http.get(z);
  }
  public getJSONModal(lat,lon,time)
  {
    var z="http://localhost:8081/darkskymodal/latitude="+lat+"&longitude="+lon+"&time="+time;
    return this.http.get(z);
  }
  public getAutocomplete(input)
  {
    var z="http://localhost:8081/autocomplete/input="+input;
    return this.http.get(z);
  }
}
