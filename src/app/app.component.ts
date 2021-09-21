import { Component } from '@angular/core';
import { dataD } from './data/data.constants';
import { ApiService } from './services/api.service';
import {Chart} from 'chart.js'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Smart Chair';
  dataHistory = []
  labelsThend = []
  dataThend = []
  dataThendMin = []
  dataSchedule=[]
  typeGraph1: string
  typeGraph2: string
  typeGraph3: string
  typeGraph4: string
  data1 = {}
  data2 = {}
  data3={}
  data4={}
  data = []
  contDias = [0, 0, 0, 0, 0, 0, 0]
  contDias2 = [0, 0, 0, 0, 0, 0, 0]
  contDias22 = [0, 0, 0, 0, 0, 0, 0]
  contDias4 = [0, 0, 0, 0, 0, 0, 0]
  chart;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    // this.apiService.getAllData().subscribe(res => {

    // console.log(res);
    let res = dataD
    this.data = res
    this.getDataThendGraph(res)
    this.getDataHistory(res)
    this.getDataBarGraph(res)
    this.getDataBarGraphMin(res)
    this.getDataSchedule(res)

  
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

  getDataThendGraph(data: object[]): void {

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
    this.typeGraph2 = 'bar';
    this.data2 = {
      labels: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
      datasets: [{
        label: 'Cantidad',
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
        borderWidth: 1,
        
      }]
 

    }


  } options = {
    responsive: true,
    // maintainAspectRatio: false
  };

  //General options for graphics
  optionsMin = {
    responsive: true,
    
   
    // maintainAspectRatio: false
  };
  getDataSchedule(data: object[]): void {
    let horaDia=0;
    let horaDia2=0;
    let horaDia3=0;

    
    data.map((val: any) => {
      if (val.tipo == 1) {
       // 2021-09-17T01:09:00.089Z
        let numeroDia = new Date(val.fecha_fin.split('T')[0] + " " + val.fecha_fin.split('T')[1].split('.')[0]).getDay();
        //this.contDias2[numeroDia]
        
        horaDia = val.fecha_fin.split('T')[1].split(':')[0] ;
        if(horaDia==horaDia2){
          if(horaDia==horaDia3){
            this.contDias4[numeroDia]=horaDia;
          }else{
            horaDia3=horaDia2;
            horaDia2=horaDia;
          }
          this.contDias4[numeroDia]=horaDia2;
        }else{
          if(horaDia2!=0&&horaDia3!=0){
            this.contDias4[numeroDia]=horaDia2;
          }else{
            this.contDias4[numeroDia]=horaDia;
          }
          horaDia2=horaDia;
          
        }
       
      }
    })
   
    let total:number=0, numero:number=0;
/*for (let index = 0; index < this.contDias2.length; index++) {
  numero = this.contDias2[index];
  //this.contDias2.fi
  total=total+numero;
  console.log(total)
  //total=total2
}*/ 


console.log(this.contDias4)
    
    this.chart = new Chart('line', {
      type: 'line',
      options: {
        responsive: true,
        
      },
      data: {
        labels: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
        datasets: [
          {
            type: 'line',
            
            label: 'Cantidad',
            data: this.contDias4,
            backgroundColor: 'rgb(64, 224, 208,0.6)',
            borderColor: '#dd3b56',
            fill: false,
          }
        ]
      }
    });

   /* let options = {
       aspectRatio: 1,
       legend: false,
      tooltips: false,
      indexAxis: 'y',
      elements: {
        point: {
          borderWidth: function (context) {
            return Math.min(Math.max(1, context.datasetIndex + 1), 8);
          },
          hoverBackgroundColor: 'white',
          hoverBorderColor: function (context) {
            return "red";
          },
          hoverBorderWidth: function (context) {
            var value = context.dataset.data[context.dataIndex];
            return Math.round(8 * value.v / 1000);
          },
          radius: function (context) {
            var value = context.dataset.data[context.dataIndex];
            var size = context.chart.width;
            var base = Math.abs(value.v) / 1000;
            return (size / 24) * base;
          }
        }
      }
    };*/
  }
  getDataBarGraphMin(data: object[]): void {
    data.map((val: any) => {
      if (val.tipo == 1) {
        let numeroDia = new Date(val.fecha_fin.split('T')[0] + " " + val.fecha_fin.split('T')[1].split('.')[0]).getDay();
        this.contDias2[numeroDia]++
        
      }
    })
    let total:number=0, numero:number=0, nuevoNumero:number=0;
for (let index = 0; index < this.contDias2.length; index++) {
  numero = this.contDias2[index];
  
  total=total+numero;
  //console.log(total)
  //total=total2
}
total=total/7;
for (let index = 0; index < this.contDias2.length; index++) {
  numero = this.contDias2[index];
  
  nuevoNumero=total-numero;
  if(nuevoNumero>0){
  this.contDias22[index]=nuevoNumero*-1
  }
  //total=total2
}



console.log(total)
    
    this.chart = new Chart('bar', {
      type: 'bar',
      options: {
        responsive: true,
        
      },
      data: {
        labels: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
        datasets: [
          {
            type: 'bar',
            
            label: 'Cantidad',
            data: this.contDias2,
            backgroundColor: 'rgb(64, 224, 208,0.6)',
            borderColor: '#dd3b56',
            fill: false,
          },
           {
             type: 'line',
             label: 'Media',
              backgroundColor: 'rgba(0,0,255,0.5)',
             borderColor: 'rgba(0,0,255,0.5)',
             data:[total,total,total,total,total,total,total],
             fill: true,
           },
           {
            type: 'bar',
            
            label: 'Veces menores a la media',
            data: this.contDias22,
            backgroundColor: 'rgb(255, 99, 71,0.6)',
            borderColor: '#dd3b56',
            fill: false,
          },
        ]
      }
    });

   /* let options = {
       aspectRatio: 1,
       legend: false,
      tooltips: false,
      indexAxis: 'y',
      elements: {
        point: {
          borderWidth: function (context) {
            return Math.min(Math.max(1, context.datasetIndex + 1), 8);
          },
          hoverBackgroundColor: 'white',
          hoverBorderColor: function (context) {
            return "red";
          },
          hoverBorderWidth: function (context) {
            var value = context.dataset.data[context.dataIndex];
            return Math.round(8 * value.v / 1000);
          },
          radius: function (context) {
            var value = context.dataset.data[context.dataIndex];
            var size = context.chart.width;
            var base = Math.abs(value.v) / 1000;
            return (size / 24) * base;
          }
        }
      }
    };*/

  }
 


  test($event: any) {
    console.log('Test', $event.value);
    let test = this.data.filter(r=> r.fecha_fin.split('T')[1].split('.')[0] == $event.value)
  }
}




