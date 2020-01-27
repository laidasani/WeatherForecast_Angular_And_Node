import { Component, OnInit, ViewChild, TemplateRef, ElementRef, AfterViewInit} from '@angular/core';
import {DataService} from '../data.service';
import {Observable} from 'rxjs/Observable';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import * as CanvasJS from '../../assets/canvasjs.min';
import {NgbModal,NgbTabsetConfig} from '@ng-bootstrap/ng-bootstrap';
import { element } from 'protractor';

@Component({
  selector: 'app-responsive',
  templateUrl: './responsive.component.html',
  styleUrls: ['./responsive.component.css'],
  
})
export class ResponsiveComponent implements OnInit {
  @ViewChild("content",{static:false})tempContent:TemplateRef<any>;
  @ViewChild("favoriteIconToggle",{static:false})favoriteIconToggle:ElementRef;

  ngOnInit() { 
    this.dataService.darkskyMODAL.subscribe(data=>{this.darkskyMODAL=data});
    this.dataService.darkskyMODALData.subscribe(data=>{this.darkskyMODALData=data});
    this.dataService.progressBoolean.subscribe(data=>{this.progressBoolean=data});
    this.dataService.favoriteArray.subscribe(data=>{this.favoriteArray=data});  
    this.dataService.darkskyJSON.subscribe(data=>{this.darkskyJSON=data});
   
  }

  
  public autocompleteOptions;

  public favoriteArray: Array<object>=[];
  public progressBoolean: boolean;
  public darkskyMODAL: any;
  public darkskyMODALData: any;
  public currentcity: string = '';
  public currentstate:string='';
  public currentFullstate:string='';
  public customImageURL: any={};
  public geolocationObj: any={};
  public latitude:string="lat";
  public longitude:string="lon";
  public darkskyJSON: any;
  public hourlyTemperature: Array<number>=[];
  public hourlyPressure: Array<number> =[];
  public hourlyHumidity: Array<number> =[];
  public hourlyOzone: Array<number> =[];
  public hourlyVisibility: Array<number> =[];
  public hourlyWindSpeed: Array<number> =[];
  public weekly: Array<number> =[];
  public stateMapping:object={};

  public maxT:number;
  public maxH:number;
  public maxV:number;
  public maxP:number;
  public maxO:number;
  public maxW:number;

  public minT:number;
  public minH:number;
  public minV:number; 
  public minP:number; 
  public minO:number; 
  public minW:number; 

  public contentDisabled: boolean=false;
  public autocompleteJSON:any;

  public goldStarBoolean:boolean=false;

  public invalidAddressBoolean:boolean=false;


  public barChartOptions: any;
  public barChartLabels: any;
  public barChartData:any;
  public barChartLegend:any;
  public barChartType:any;





  /**Form Validation */
   angForm: FormGroup;
   

   constructor(private fb: FormBuilder,private dataService: DataService, private ModalService: NgbModal,config: NgbTabsetConfig) {

    this.stateMapping={"AL":"Alabama"	
		,"AK":"Alaska"
		,"AZ":"Arizona"	
		,"AR":"Arkansas"	
		,"CA":"California"
		,"CO":"Colorado"	
		,"CT":"Connecticut"	
		,"DE":"Delaware"
		,"DC":"District Of Columbia"	
		,"FL":"Florida"
		,"GA":"Georgia"	
		,"HI":"Hawaii"	
		,"ID":"Idaho"	
		,"IL":"Illinois"	
		,"IN":"Indiana"	
		,"IA":"Iowa"
		,"KS":"Kansas"	
		,"KY":"Kentucky"	
		,"LA":"Louisiana"	
		,"ME":"Maine"
		,"MD":"Maryland"	
		,"MA":"Massachusetts"	
		,"MI":"Michigan"
		,"MN":"Minnesota"	
		,"MS":"Mississippi"	
		,"MO":"Missouri"
		,"MT":"Montana"	
		,"NE":"Nebraska"	
		,"NV":"Nevada"
		,"NH":"New Hampshire"	
		,"NJ":"New Jersey"
		,"NM":"New Mexico"	
		,"NY":"New York"	
		,"NC":"North Carolina"	
		,"ND":"North Dakota"
		,"OH":"Ohio"
		,"OK":"Oklahoma"	
		,"OR":"Oregon"
		,"PA":"Pennsylvania"	
		,"RI":"Rhode Island"	
		,"SC":"South Carolina"	
		,"SD":"South Dakota"
		,"TN":"Tennessee"
		,"TX":"Texas"
		,"UT":"Utah"	
		,"VT":"Vermont"	
		,"VA":"Virginia"	
		,"WA":"Washington"	
		,"WV":"West Virginia"	
		,"WI":"Wisconsin"
		,"WY":"Wyoming"	
   }

     if(localStorage.getItem("items"))
     {
      this.dataService.setItemArray(JSON.parse(localStorage.getItem("items")));
     }

     config.justify = 'center';
     config.type = 'pills';
      
     
     
     this.angForm = this.fb.group({
      street: ['', Validators.required ],
       city: ['', Validators.required ],
      state: ['', Validators.required ],
      currentLocation: []
    });
    
    this.createForm();
   
  }
  
   createForm() {

    

    if(this.contentDisabled)
    {
      this.angForm = this.fb.group({
      street: [this.angForm.get('street').value],
            city: [this.angForm.get('city').value],
           state: [this.angForm.get('state').value],
           currentLocation:['checked']
 
      });

      
    }
    
    else
    {
      
    this.angForm = this.fb.group({
      street: [this.angForm.get('street').value, Validators.required ],
       city: [this.angForm.get('city').value, Validators.required ],
      state: [this.angForm.get('state').value, Validators.required ],
      currentLocation: []
    });
    
  }
  
   	
   }
    
  

  public toggleEditable(event) {
    if ( event.target.checked ) {
        this.contentDisabled = true;

    
        this.angForm.controls['street'].disable();    
        this.angForm.controls['city'].disable();
        this.angForm.controls['state'].disable();
        
   }
   else
   {
     this.contentDisabled = false;

     this.angForm.controls['street'].enable();
        this.angForm.controls['city'].enable();
        this.angForm.controls['state'].enable();
   }
   this.createForm();
}

/**Clear Button */

public clearForm()
{
  if(this.contentDisabled)
  {
    this.angForm.controls['street'].enable();
    this.angForm.controls['city'].enable();
    this.angForm.controls['state'].enable(); 
  }
  this.contentDisabled = false;
  this.createForm();

  this.angForm.get('currentLocation').setValue('');
  this.angForm.get('state').setValue('');
  this.angForm.get('city').setValue('');
  this.angForm.get('street').setValue('');
  this.dataService.setdarkskyJSON({});
  this.invalidAddressBoolean=false;
}


/**JSON Data Dark Sky Loading */

  public loadJSON(check) {

    this.darkskyJSON={};
    this.customImageURL={};
    this.maxT=0;
    this.maxH=0;
    this.maxV=0;
    this.maxP=0;
    this.maxO=0;
    this.maxW=0;
  
    this.minT=100000;
    this.minH=100000;
    this.minV=100000;
    this.minP=100000;
    this.minO=100000;
    this.minW=100000;
    this.hourlyHumidity=[];
    this.hourlyOzone=[];
    this.hourlyWindSpeed=[];
    this.hourlyPressure=[];
    this.hourlyVisibility=[];
    this.hourlyTemperature=[];
  
    this.weekly=[];

      this.dataService.setProgressBoolean(true);
   
      //Favorite Case
      if(check==0)
      {
        this.loadStateSeal(this.currentFullstate);
        this.loadDarkSky();
      }
      else
      {
        //IP API Case
        if(this.contentDisabled)
				{
            
					  var xmlhttp=new XMLHttpRequest();
			  		xmlhttp.open("GET","http://ip-api.com/json",false);
				  	xmlhttp.send();
	          		var response = xmlhttp.responseText;
	          		var jsonObj= JSON.parse(response);

                this.latitude=jsonObj.lat;
                this.longitude=jsonObj.lon;
                this.currentcity=jsonObj.city;
                this.currentstate=jsonObj.region;
                this.currentFullstate=jsonObj.regionName;
                this.loadStateSeal(this.currentFullstate);
                this.loadDarkSky();
                
        }
        else
        {
          
          var x=this.angForm.get('street').value;
          var y=this.angForm.get('city').value;
          var z=this.angForm.get('state').value;
          var lat: string;
          var lon: string;

          this.dataService.getGeo(x,y,z).subscribe(data => { this.geolocationObj = data},
          err => console.error(err),
          () => 
          {
            if(this.geolocationObj.hasOwnProperty("Error"))
            {
              this.dataService.setProgressBoolean(false);
              this.invalidAddressBoolean=true;
            }
            else
            {
              this.latitude=this.geolocationObj.latitude;
              this.longitude=this.geolocationObj.longitude;
              
              this.currentstate=this.angForm.get('state').value;
              this.currentcity=this.angForm.get('city').value;
              this.currentFullstate=this.stateMapping[this.currentstate];
              this.loadStateSeal(this.currentFullstate);
              this.loadDarkSky();
            }
              
          }
         
     

          );

        }


  }
}


  public loadDarkSky()
  {
    this.goldStarBoolean=false;
    let x:{};
              /**Dark Sky*/
              this.dataService.getJSON(this.latitude,this.longitude).subscribe(data => { x = data},
                err => console.error(err),
                () => {

                  this.dataService.setdarkskyJSON(x);
                  /**Hourly Data */
                  let i:number=0;
                
                  let tempObj=this.darkskyJSON.hourly;
                  for(i=0;i<24;i++)
                  {
                    if(tempObj.data[i].temperature>this.maxT)
                    {
                      this.maxT=tempObj.data[i].temperature;
                    }
                    if(tempObj.data[i].temperature<this.minT)
                    {
                      this.minT=tempObj.data[i].temperature;
                    }
                  
                    this.hourlyTemperature.splice(i,1,Math.round(tempObj.data[i].temperature));
    
                    if(tempObj.data[i].pressure>this.maxP)
                    {
                      this.maxP=tempObj.data[i].pressure;
                    }
                    if(tempObj.data[i].pressure<this.minP)
                    {
                      this.minP=tempObj.data[i].pressure;
                    }
                    this.hourlyPressure.push((tempObj.data[i].pressure).toFixed(2));

                    if(tempObj.data[i].humidity>this.maxH)
                    {
                      this.maxH=tempObj.data[i].humidity;
                      this.maxH=this.maxH*100;
                    }
                    if(tempObj.data[i].humidity<this.minH)
                    {
                      this.minH=tempObj.data[i].humidity;
                      this.minH=this.minH*100;
                    }
                    this.hourlyHumidity.push(Math.round((tempObj.data[i].humidity)*100));
    
                    if(tempObj.data[i].ozone>this.maxO)
                    {
                      this.maxO=tempObj.data[i].ozone;
                    }
                    if(tempObj.data[i].ozone<this.minO)
                    {
                      this.minO=tempObj.data[i].ozone;
                    }
                    this.hourlyOzone.push((tempObj.data[i].ozone).toFixed(2));

                    if(tempObj.data[i].visibility>this.maxV)
                    {
                      this.maxV=tempObj.data[i].visibility;
                    }
                    if(tempObj.data[i].visibility<this.minV)
                    {
                      this.minV=tempObj.data[i].visibility;
                    }
                    this.hourlyVisibility.push((tempObj.data[i].visibility).toFixed(2));
    
                    if(tempObj.data[i].windSpeed>this.maxW)
                    {
                      this.maxW=tempObj.data[i].windSpeed;
                    }
                    if(tempObj.data[i].windSpeed<this.minW)
                    {
                      this.minW=tempObj.data[i].windSpeed;
                    }
                    this.hourlyWindSpeed.push((tempObj.data[i].windSpeed).toFixed(2));
                    
                  }

               
                  this.loadHourly();

                  let itemsArray= localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

                  for(let element of itemsArray)
                  {
                    if(element.city===this.currentcity && element.state===this.currentstate)
                    {
                      this.goldStarBoolean=true;
                      break;
                    }
                  }

                  /**Weekly Data */
                  let tempObj2: any={};
                  tempObj2=this.darkskyJSON.daily.data;
                  for(i=0;i<8;i++)
                  {
                    let weeklyrow: any={};
                    let temperatureArr: Array<number> =[];
                    var currentTime=tempObj2[i].time;
                    var date = new Date(currentTime*1000);
                    var stringDate=date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear();
    
                    temperatureArr.push(Math.round(tempObj2[i].temperatureLow));
                    temperatureArr.push(Math.round(tempObj2[i].temperatureHigh));
                    
                    weeklyrow={y:temperatureArr,label:stringDate};
                    this.weekly.push(weeklyrow);
                    
                    
                  }
              
                  this.dataService.setProgressBoolean(false);

                }
                
                

        );
       

       
  }

  public loadStateSeal(z)
  {
    this.dataService.getCustomImage(z).subscribe(data => { this.customImageURL = data},
      err => console.error(err),
      () => {
      }

    );
    
    
  }

  /** For Hourly Chart*/

 public loadHourly()
 {

  
  this.barChartOptions = 
  {
   scaleShowVerticalLines: false,
   legend: {onClick:(e)=>e.stopPropagation()},
   responsive: true,
   scales: {
   yAxes: [{
    ticks: {
      suggestedMax: this.maxT+1,
      suggestedMin:this.minT-1,
      maxTicksLimit: 8
  },
     scaleLabel: {
       display: true,
       labelString: 'Farhenheit'
     }
   }],
   xAxes: [{
     scaleLabel: {
       display: true,
       labelString: 'Time difference from current hour'
     }
   }]

 }     
 };

 this.barChartLabels = ['0', '1', '2', '3', '4', '5', '6','7', '8', '9', '10', '11', '12', '13', '14', '15', '16','17','18','19','20','21','22','23'];

 this.barChartType = 'bar';

 this.barChartLegend = true;


 this.barChartData = [
   {data:this.hourlyTemperature, label: 'temperature', backgroundColor: '#80C1EB', hoverBackgroundColor: '#4E83A5'}
 ];



}


 public selectedField(x)
 {
 if(x==="hourlyPressure")
 {

      this.barChartOptions = 
      {
       scaleShowVerticalLines: false,
       legend: {onClick:(e)=>e.stopPropagation()},
       responsive: true,
       scales: {
       yAxes: [{
        ticks: {
          suggestedMax: this.maxP+1,
          suggestedMin:this.minP-1,
          maxTicksLimit: 8
      },
         scaleLabel: {
           display: true,
           labelString: 'Millibars'
         }
       }],
       xAxes: [{
         scaleLabel: {
           display: true,
           labelString: 'Time difference from current hour'
         }
       }]

     }     
     };

     this.barChartData = [
     {data: this.hourlyPressure, label: 'Pressure', backgroundColor: '#80C1EB', hoverBackgroundColor: '#4E83A5'}
     ];
 }
 else if(x==="hourlyHumidity")
 {

      this.barChartOptions = 
      {
       scaleShowVerticalLines: false,
       legend: {onClick:(e)=>e.stopPropagation()},
       responsive: true,
        
       scales: {
       yAxes: [{
        ticks: {
          suggestedMin:this.minH-1,
          suggestedMax: this.maxH+1,
          maxTicksLimit: 8
         
      },
         scaleLabel: {
           display: true,
           labelString: '% Humidity'
         }
       }],
       xAxes: [{
         scaleLabel: {
           display: true,
           labelString: 'Time difference from current hour'
         }
       }]
     }  
     };

     this.barChartData = [
     {data: this.hourlyHumidity, label: 'humidity', backgroundColor: '#80C1EB', hoverBackgroundColor: '#4E83A5'}
     ];
 }
 else if(x==="hourlyOzone")
 {
      this.barChartOptions = 
      {
       scaleShowVerticalLines: false,
       legend: {onClick:(e)=>e.stopPropagation()},
       responsive: true,
       scales: {
       yAxes: [{
        ticks: {
          suggestedMax: this.maxO+1,
          suggestedMin:this.minO-1,
          maxTicksLimit: 8
      },
         scaleLabel: {
           display: true,
           labelString: 'Dobson Units'
         }
       }],
       xAxes: [{
         scaleLabel: {
           display: true,
           labelString: 'Time difference from current hour'
         }
       }]

     }     
     };

    
     this.barChartData = [
     {data: this.hourlyOzone, label: 'ozone', backgroundColor: '#80C1EB', hoverBackgroundColor: '#4E83A5'}
     ];
 }
 else if(x==="hourlyVisibility")
 {
      this.barChartOptions = 
      {
       scaleShowVerticalLines: false,
       legend: {onClick:(e)=>e.stopPropagation()},
       responsive: true,
       scales: {
       yAxes: [{
        ticks: {
          suggestedMax: this.maxV+.01,
          suggestedMin:this.minV==this.maxV?0:this.minV-.01,
          maxTicksLimit: 8
      },
         scaleLabel: {
           display: true,
           labelString: 'Miles (Maximum 10)'
         }
       }],
       xAxes: [{
         scaleLabel: {
           display: true,
           labelString: 'Time difference from current hour'
         }
       }]

     }     
     };

     this.barChartData = [
     {data: this.hourlyVisibility, label: 'visibility', backgroundColor: '#80C1EB', hoverBackgroundColor: '#4E83A5'}
     ];
 }
 else if(x==="hourlyWindSpeed")
 {
      this.barChartOptions = 
      {
       scaleShowVerticalLines: false,
       legend: {onClick:(e)=>e.stopPropagation()},
       responsive: true,
       scales: {
       yAxes: [{
        ticks: {
          suggestedMax: this.maxW+1,
          suggestedMin:this.minW-1,
          maxTicksLimit: 8
      },
         scaleLabel: {
           display: true,
           labelString: 'Miles per Hour'
         }
       }],
       xAxes: [{
         scaleLabel: {
           display: true,
           labelString: 'Time difference from current hour'
         }
       }]

     }     
     };

     this.barChartData = [
     {data: this.hourlyWindSpeed, label: 'windSpeed', backgroundColor: '#80C1EB', hoverBackgroundColor: '#4E83A5'}
     ];
 }
 else
 {

     this.barChartOptions = 
      {
       scaleShowVerticalLines: false,
       legend: {
         onClick: (e) => e.stopPropagation()
        },
       responsive: true,
       scales: {
       yAxes: [{
        ticks: {
          suggestedMax: this.maxT+1,
          suggestedMin:this.minT-1,
          maxTicksLimit: 8
      },
         scaleLabel: {
           display: true,
           labelString: 'Farhenheit'
         }
       }],
       xAxes: [{
         scaleLabel: {
           display: true,
           labelString: 'Time difference from current hour'
         }
       }]

     }     
     };
     this.barChartData = [
     {data: this.hourlyTemperature, label: 'temperature', backgroundColor: '#80C1EB', hoverBackgroundColor: '#4E83A5'}
     ];
 }
 

 }
   

  /**Weekly Chart */
  public loadWeekly()
  {

  
      let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        dataPointWidth: 15,
        legend: {
          verticalAlign:"top",
          horizontalAlign:"top"
        },
        title: {
          text: "Weekly Weather"
        },
        axisX: {
          title: "Days"
        },
        axisY: {
          includeZero: false,
          title: "Temperature in Farhenheit",
          interval: 10,
          gridThickness: 0
        }, 
        data: [{
          color:"#89CCF9",
          showInLegend: true,
          click:onClick,
          type: "rangeBar",
          indexLabel: "{y[#index]}",
          legendText: "Day wise temperature range",
          toolTipContent: "<b>{label}</b>: {y[0]} to {y[1]}",
          dataPoints: this.weekly
        }]
      });

      setTimeout(function()
      {
        chart.render();

      
      },300);


    let p=this.darkskyJSON.daily.data;
    let lat=this.latitude;
    let lon=this.longitude;
    let ds=this.dataService;
    let ms=this.ModalService;
    let tC=this.tempContent;

    

    function onClick(e)
    {
 
      let time=p[e.dataPoint.x].time;
      ds.getJSONModal(lat,lon,time).subscribe(data => { this.darkskyMODAL = data},
        err => console.error(err),
        () => {
          
          
          ds.setModal(this.darkskyMODAL);

          var modalDate=this.darkskyMODAL.daily.data[0].time;
          var mdate = new Date(modalDate*1000);
          var modalStringDate=mdate.getDate()+"/"+mdate.getMonth()+"/"+mdate.getFullYear();
          

          var modalTemperature:number=this.darkskyMODAL.currently.temperature;
          var modalSummary=this.darkskyMODAL.currently.summary;
          var icon=this.darkskyMODAL.currently.icon;
          var modalImg;
          if(icon==="clear-day" || icon==="clear-night")
          {
            modalImg="https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png";
          }
          else if(icon==="rain")
          {
            modalImg="https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png";
          }
          else if(icon==="snow")
          {
            modalImg="https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png";
          }
          else if(icon==="sleet")
          {
            modalImg="https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png";
          }
          else if(icon==="wind")
          {
            modalImg="https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png";
          }
          else if(icon==="fog")
          {
            modalImg="https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png";
          }
          else if(icon==="cloudy")
          {
            modalImg="https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png";
          }
          else
          {
            modalImg="https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png";
          }

          var modalP;
          var modalC;
          var modalW;
          var modalH;
          var modalV;
          if(this.darkskyMODAL.currently.hasOwnProperty("precipIntensity"))
          {
            modalP:Number;
              if((this.darkskyMODAL.currently.precipIntensity)*100<1)
              {
                modalP=0;
              }
              else
              {
                modalP=(this.darkskyMODAL.currently.precipIntensity).toFixed(2);
              }
          }
          else
          {
            modalP="N/A";
          }
          if(this.darkskyMODAL.currently.hasOwnProperty("precipProbability"))
          {
            modalC:Number;
              modalC=Math.round((this.darkskyMODAL.currently.precipProbability)*100);
          }
          else
          {
            modalC="N/A";
          }
          if(this.darkskyMODAL.currently.hasOwnProperty("windSpeed"))
          {
            modalW:Number;
            if((this.darkskyMODAL.currently.windSpeed)*100<1)
              {
                modalW=0;
              }
              else
              {
                modalW=(this.darkskyMODAL.currently.windSpeed).toFixed(2);
              }
          }
          else
          {
            modalW="N/A";
          }
          if(this.darkskyMODAL.currently.hasOwnProperty("humidity"))
          {
            modalH:Number;
              modalH=Math.round((this.darkskyMODAL.currently.humidity)*100);
          }
          else
          {
            modalH="N/A";
          }
          if(this.darkskyMODAL.currently.hasOwnProperty("visibility"))
          {
            modalV:Number;
            if((this.darkskyMODAL.currently.visibility)*100<1)
              {
                modalV=0;
              }
              else
              {
                modalV=(this.darkskyMODAL.currently.visibility).toFixed(2);
              }
          }
          else
          {
            modalV="N/A";
          }

          this.darkskyMODALData={'image':modalImg, 'date':modalStringDate, 'temperature':modalTemperature,'summary':modalSummary,
        'precipitation': modalP, 'rain':modalC,'wind':modalW,'humidity':modalH,'visibility':modalV};
          ds.setModalData(this.darkskyMODALData);
          

          ms.open(tC);
        }
 
      );
     
    }

    
  }

  /**Local Storage */
  public favoritesAdd()
  {
    // localStorage.clear();
    let idx=0;
    let flag=0;
    let itemsArray= localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

    for(let element of itemsArray)
    {
      if(element.city===this.currentcity && element.state===this.currentstate)
      {
        itemsArray.splice(idx,1);
        localStorage.setItem("items",JSON.stringify(itemsArray));
        this.goldStarBoolean=false;
        flag=1;
        break;
      }
      idx++;
    }

    if(flag===0)
    {
      let obj:object={};
      obj={"city":this.currentcity,"state":this.currentstate,"stateImg":this.customImageURL.link,"latitude":this.latitude,"longitude":this.longitude};
      itemsArray.push(obj);
      localStorage.setItem("items",JSON.stringify(itemsArray));

      this.goldStarBoolean=true;
    }
    this.dataService.setItemArray(JSON.parse(localStorage.getItem("items")));
  


  }
  public deleteFavorite(a)
  {
    let itemsArray=JSON.parse(localStorage.getItem('items'));
    itemsArray.splice(a,1);
    localStorage.setItem("items",JSON.stringify(itemsArray));
    this.dataService.setItemArray(JSON.parse(localStorage.getItem("items")));
  

  }
  public loadFromFavorite(b)
  {
    this.goldStarBoolean=true;
    
    let itemsArray=JSON.parse(localStorage.getItem('items'));
    this.currentcity=itemsArray[b].city;
    this.currentstate=itemsArray[b].state
    this.currentFullstate=this.stateMapping[this.currentstate];
    this.latitude=itemsArray[b].latitude;
    this.longitude=itemsArray[b].longitude;

    this.loadJSON(0);

    
    
  }


  /**Autocomplete */
  public autocompleteHelper()
  {
    if(this.angForm.get('city').value==="")
    {
      this.autocompleteOptions=[];
    }
    else
    {
      let arr:Array<String>=[];
    this.dataService.getAutocomplete(this.angForm.get('city').value).subscribe(data => { this.autocompleteJSON = data},
      err => this.autocompleteOptions=[],
      () => {

        if(this.autocompleteJSON.hasOwnProperty("Error"))
            {
              this.autocompleteOptions=[];
            }
        else
        {
          let tempo=Math.min(this.autocompleteJSON.predictions.length,5);
          for(let i=0;i<tempo;i++)
          {
            arr.push(this.autocompleteJSON.predictions[i].structured_formatting.main_text);
          }
          this.autocompleteOptions=arr;
        }
        
        
      })
    }
    
  }
  

}