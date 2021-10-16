import { Component } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'front';
  data:any
  listDays = []
  listDaysTmp = []
  date ={
    day: 0,
    weekday:''
  }

  dataWeather = {
    temperatura: 0,
    humedad: 0,
    fecha:'',
    intensidad: 0,
    lluvia: 0,
    dviento: '',
    vviento: '',
    day:'',
    weekday:'',
    image:''
  }

  constructor(private apiService: ApiService) {

  }

  ngOnInit(): void {

    setInsterval(() => {
      this.apiService.getAllData().subscribe(res => {
        // console.log(res);
        this.data = res
        let data = res[res.length -1]
        this.dataWeather.dviento = data.dviento
        this.dataWeather.fecha = data.fecha
        this.dataWeather.humedad = data.humedad
        this.dataWeather.intensidad = data.intensidad
        this.dataWeather.lluvia = data.lluvia
        this.dataWeather.temperatura = data.temperatura
        this.dataWeather.vviento = data.vviento
        
        this.dataWeather.day = data.fecha.split('T')[0].split('-')[2]
  
        let numberDay = new Date(data.fecha.split('T')[0] + " " + data.fecha.split('T')[1].split('.')[0]).getDay();
        this.dataWeather.weekday = this.getWeekday(numberDay)      
        this.filterData()
      })
  
    },1000) 
  
  }

  
  filterData():void{
    
    this.data.map((v:any)=>{
      
      let numberDay = new Date(v.fecha.split('T')[0] + " " + v.fecha.split('T')[1].split('.')[0]).getDay();
      
      if(this.listDays.length === 0){   
        this.getImage(v)
        v.day = v.fecha.split('T')[0].split('-')[2]     
        v.weekday = this.getWeekday(numberDay)
        this.listDays.push(v)
      
      }else{
        
        let res = this.listDays.filter((l:any)=>{
          return l.fecha.split('T')[0] === v.fecha.split('T')[0]
        })
        
        if(res.length <= 0){
          
          this.getImage(v)
          v.day = v.fecha.split('T')[0].split('-')[2]
          v.weekday = this.getWeekday(numberDay)
          this.listDays.push(v) 
          
        }
      }

    }) 

    console.log(this.listDays);
    
    this.listDaysTmp = [...this.listDays];
  }

  getImage(v):void{

    if(v.intensidad > 1000){
      v.image = '../assets/sun.png'
    }else if(v.intensidad <= 1000 && v.intensidad >= 100){
      v.image = '../assets/medio.png'
    }else{
      v.image = '../assets/lluvia.png'
    }
  }

  getWeekday(numberDay:number):string{
    const weekday = new Array(7);
    
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    const n = weekday[numberDay];
    return n
  }

  searchByDate($event):void{
    
    this.listDays = [...this.listDaysTmp];

    let index = this.listDays.findIndex( r=> r.fecha.split('T')[0] === $event.value);
    this.listDays = this.listDays.splice(index)

  }

}
