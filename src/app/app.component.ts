import { Component } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title:string = 'Smart Chair';
  dataHistory = []
  labelsThend = []
  dataThend = []
  typeGraph1: string
  typeGraph2: string
  data1 = {}
  data2 = {}
  data = []
  contDias:number[] =[0, 0, 0, 0, 0, 0, 0]
  currentData = []
  totalMinutes:number = 0
  totalMinutesPerDay:number = 0


  constructor(private apiService: ApiService) {
    const today = new Date();
    let currentDate = today.getFullYear() + '-' + '0' + (today.getMonth() + 1) + '-' + today.getDate();
    // let currentDate = today.getFullYear() + '-' + '0'+(today.getMonth() + 1) + '-' + "17";
    this.getDataNow(currentDate)
    this.searchByDate(currentDate)
  }

  ngOnInit() {
    this.apiService.getAllData().subscribe(res => {
      this.data = res
      console.log(res);
      
      this.getDataThendGraph(res)
      this.getDataBarGraph(res)
      this.totalMinutes =  this.calculateTotalMinutes(res.filter((r:any)=> r.tipo == 1))
    })
  }


  getDataThendGraph(data): void {

    let hash = {};
    data = data.filter(r => r.tipo == 2).filter(o => hash[o.fecha_inicio.split('T')[0]] ? false : hash[o.fecha_inicio.split('T')[0]] = true);

    data.map((val: any) => {
      if (val.tipo == 2) {
        this.labelsThend.push(val.fecha_fin.split('T')[0])
        this.dataThend.push(val.valor)
      }
    })
    this.labelsThend.reverse()
    this.dataThend.reverse()

    // 1. Thend graph
    this.typeGraph1 = 'line';
    this.data1 = {
      labels: this.labelsThend,
      datasets: [
        {
          label: "Peso en lb",
          data: this.dataThend,
          fill: false,
          borderColor: '#dd3b56',
          tension: 0.1
        }
      ]
    };
  }


  getDataBarGraph(data: object[]): void {
    data.map((val: any) => {
      if (val.tipo == 1) {
        let numeroDia = new Date(val.fecha_fin.split('T')[0] + " " + val.fecha_fin.split('T')[1].split('.')[0]).getDay();
        this.contDias[numeroDia]++
      }
    })

    // 2. Bar graph
    this.typeGraph2 = 'pie'; //pie
    this.data2 = {
      labels: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
      datasets: [{
        label: '',
        data: this.contDias,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 2
      }]
    }

  }

  //General options for graphics
  options = {
    responsive: true,
  };

  searchByDate($event: any):void {
    // console.log($event.value);
    this.dataHistory = []
    this.apiService.getDatabyDate({ date: $event.value ? $event.value : $event }).subscribe(res => {
      this.getDataHistory(res)
    })
  }

  getDataHistory(data: object[]): void {
    data.map((val: any) => {
      if (val.tipo == 1) {
        this.dataHistory.push({
          date: val.fecha_inicio.split('T')[0],
          startTime: val.fecha_inicio.split('T')[1].split('.')[0],
          endTime: val.fecha_fin.split('T')[1].split('.')[0]
        })
      }
    })
  }

  getDataNow(currentDate: string): void {
    this.apiService.getDatabyDate({ date: currentDate }).subscribe(res => {
      this.currentData = res.filter(r => r.tipo === 1)
      this.totalMinutesPerDay = this.calculateTotalMinutes(this.currentData)
    })
  }

  calculateTotalMinutes(data): number {
    let totalMinutes = 0
    data.map(val => {
      let startTime = new Date(val.fecha_inicio);
      let endTime = new Date(val.fecha_fin);
      let difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds  
      let resultInMinutes = Math.round(difference / 60000);
      totalMinutes += resultInMinutes
    })

    return totalMinutes
  }

  insertData():void {
    let data = {
      "tipo": 1,
      "valor": 0,
      "estado": 1,
      "dias": 0,
      "horas": 3,
      "minutos": 30
    }

    this.apiService.insertData(data).subscribe(res => {
      console.log(res);
    })

  }


}


