import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { ApiService } from './services/api.service';
import { dataD } from './data/data.constants';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title: string = 'Smart Chair';
  dataHistory = []
  dataHistory2 = []
  labelsThend = []
  dataThend = []
  labelsThend5 = []
  dataThend5 = []
  labelsThend6 = []
  dataThend6 = []
  dataThendMin = []
  dataSchedule = []
  typeGraph1: string
  typeGraph2: string
  typeGraph3: string
  typeGraph4: string
  typeGraph5: string
  typeGraph6: string
  typeGraph7: string
  data1 = {}
  data2 = {}
  data3 = {}
  data4 = {}
  data5 = {}
  data6 = {}
  data7 = {}
  data = []
  contDias = [0, 0, 0, 0, 0, 0, 0]
  contDias2 = [0, 0, 0, 0, 0, 0, 0]
  contDias22 = [0, 0, 0, 0, 0, 0, 0]
  contDias4 = [0, 0, 0, 0, 0, 0, 0]
  contDias7 = [0, 0, 0, 0, 0, 0, 0]
  chart;
  currentData = []
  totalMinutes: number = 0
  totalMinutesPerDay: number = 0
  weightReal: number = 0
  estadoReal: string
  vecesExcedidas: number = 0


  constructor(private apiService: ApiService) {
    const today = new Date();
    let currentDate = today.getFullYear() + '-' + '0' + (today.getMonth() + 1) + '-' + today.getDate();   
    // let currentDate = today.getFullYear() + '-' + '0'+(today.getMonth() + 1) + '-' + "17";
    console.log(currentDate)
    this.getDataNow(currentDate)
    this.searchByDate(currentDate)
  }

  ngOnInit() {
    this.apiService.getAllData().subscribe(res => {
     // let res = dataD
      this.data = res
      this.getDataThendGraph(res)
      this.getDataThendGraphMalUso(res)
      this.getDataThendGraphMuchoUso(res)
      this.getDataBarGraph(res)
      this.getDataBarGraph7(res)
      this.getDataBarGraphMin(res)
      this.getDataSchedule(res)
      this.totalMinutes = this.calculateTotalMinutes(res.filter((r: any) => r.tipo == 1))
    })

    // console.log('Data', res);
    //Tipo 1 (Peso del que se sonto) Estado 1, si se levanta a estado 2
    //Tipo 2 (Sento) y Tipo 4(Levanto) sensor ultrasonico -- Se omite el estado

    //1 esta snetado y 0 esta parado
    // Esto es lo que paso
    //   {
    //     "inicio": "2021-09-24T00:41:35.900Z",
    //     "fin": "2021-09-24T00:42:52.344Z",
    //     "peso": 0,
    //     "sentado": 0
    // }

    setInterval(() => {
      this.apiService.last({}).subscribe(res => {

        this.weightReal = res.peso
        
    this.timeStart = res.inicio.split('T')[1].split('.')[0]

        if (res.inicio == res.fin) {
          this.cronometro2()
          
        } else {
          this.parar2()
         
       }
      })
      this.apiService.lasttiempo({}).subscribe(res => {

        
        console.log(res)
        if(res.sentado==1){
          this.estadoReal="Buena Postura"
          this.parar()
        }else if(res.sentado==6){
          this.estadoReal="Mala Postura"
          this.cronometro()
          this.timeStart2 = res.inicio.split('T')[1].split('.')[0]
        }else{
          this.estadoReal=" "
        }

      }
      
      )
    }, 1000);

  }


  parar() {
    this.h = 0;
    this.m = 0;
    this.s = 0;
    this.time = "00:00:00"
  }

  time = ""
  timeStart =""
  s = 0
  m = 0
  h = 0
  cronometro() {

    var hAux, mAux, sAux;
    this.s++;

    if (this.s > 59) { this.m++; this.s = 0; }
    if (this.m > 59) { this.h++; this.m = 0; }
    if (this.h > 24) { this.h = 0; }

    if (this.s < 10) { sAux = "0" + this.s; } else { sAux = this.s; }
    if (this.m < 10) { mAux = "0" + this.m; } else { mAux = this.m; }
    if (this.h < 10) { hAux = "0" + this.h; } else { hAux = this.h; }

    this.time = hAux + ":" + mAux + ":" + sAux
  }
  parar2() {
    this.h2 = 0;
    this.m2 = 0;
    this.s2 = 0;
    this.time2= "00:00:00"
  }

  time2 = ""
  timeStart2 =""
  s2 = 0
  m2 = 0
  h2 = 0
  cronometro2() {

    var hAux, mAux, sAux;
    this.s2++;

    if (this.s2 > 59) { this.m2++; this.s2 = 0; }
    if (this.m2 > 59) { this.h2++; this.m2 = 0; }
    if (this.h2 > 24) { this.h2 = 0; }

    if (this.s2 < 10) { sAux = "0" + this.s2; } else { sAux = this.s2; }
    if (this.m2 < 10) { mAux = "0" + this.m2; } else { mAux = this.m2; }
    if (this.h2 < 10) { hAux = "0" + this.h2; } else { hAux = this.h2; }

    this.time2 = hAux + ":" + mAux + ":" + sAux
  }

  getDataThendGraph(data): void {

    let hash = {};
    data = data.filter(r => r.tipo == 1).filter(o => hash[o.fecha_inicio.split('T')[0]] ? false : hash[o.fecha_inicio.split('T')[0]] = true);

    data.map((val: any) => {
      if (val.tipo == 1) {
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
          label: "Peso en kg",
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


  } options = {
    responsive: true,
    // maintainAspectRatio: false
  };
  getDataBarGraph7(data: object[]): void {
    data.map((val: any) => {
      if (val.tipo == 5) {
        let numeroDia = new Date(val.fecha_fin.split('T')[0] + " " + val.fecha_fin.split('T')[1].split('.')[0]).getDay();
        this.contDias7[numeroDia]++
      }
    })

    // 2. Bar graph
    this.typeGraph7 = 'pie'; //pie
    this.data7 = {
      labels: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
      datasets: [{
        label: '',
        data: this.contDias7,
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
  optionsMin = {
    responsive: true,
  };

  getDataSchedule(data: object[]): void {
    let horaDia = 0;
    let horaDia2 = 0;
    let horaDia3 = 0;


    data.map((val: any) => {
      if (val.tipo == 1) {
        // 2021-09-17T01:09:00.089Z
        let numeroDia = new Date(val.fecha_fin.split('T')[0] + " " + val.fecha_fin.split('T')[1].split('.')[0]).getDay();
        //this.contDias2[numeroDia]

        horaDia = val.fecha_fin.split('T')[1].split(':')[0];
        if (horaDia == horaDia2) {
          if (horaDia == horaDia3) {
            this.contDias4[numeroDia] = horaDia;
          } else {
            horaDia3 = horaDia2;
            horaDia2 = horaDia;
          }
          this.contDias4[numeroDia] = horaDia2;
        } else {
          if (horaDia2 != 0 && horaDia3 != 0) {
            this.contDias4[numeroDia] = horaDia2;
          } else {
            this.contDias4[numeroDia] = horaDia;
          }
          horaDia2 = horaDia;

        }

      }
    })

    let total: number = 0, numero: number = 0;
    /*for (let index = 0; index < this.contDias2.length; index++) {
      numero = this.contDias2[index];
      //this.contDias2.fi
      total=total+numero;
      console.log(total)
      //total=total2
    }*/


    //console.log(this.contDias4)

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

            label: 'Hora',
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
    let total: number = 0, numero: number = 0, nuevoNumero: number = 0;
    for (let index = 0; index < this.contDias2.length; index++) {
      numero = this.contDias2[index];

      total = total + numero;
      //console.log(total)
      //total=total2
    }
    total = total / 7;
    for (let index = 0; index < this.contDias2.length; index++) {
      numero = this.contDias2[index];

      nuevoNumero = total - numero;
      if (nuevoNumero > 0) {
        this.contDias22[index] = nuevoNumero * -1
      }
      //total=total2
    }


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
            data: [total, total, total, total, total, total, total],
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
  getDataThendGraphMalUso(data): void {

    let hash = {};
    let conteo=0
    data = data.filter(r => r.tipo == 6).filter(o => hash[o.fecha_inicio.split('T')[0]] ? false : hash[o.fecha_inicio.split('T')[0]] = true);

    data.map((val: any) => {
      if (val.tipo == 6) {
        conteo=conteo+1
        this.labelsThend5.push(val.fecha_fin.split('T')[0])
        this.dataThend5.push(conteo)
      }
    })
    this.labelsThend5.reverse()
    this.dataThend5.reverse()

    // 1. Thend graph
    this.typeGraph5 = 'line';
    this.data5 = {
      labels: this.labelsThend5,
      datasets: [
        {
          label: "Veces detectadas de una mal postura",
          data: this.dataThend5,
          fill: false,
          borderColor: '#dd3b56',
          tension: 0.1
        }
      ]
    };
  }
 

  searchByDate($event: any): void {
    // console.log($event.value);
    // {
    //   date: 2021-09-21
    // }
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
      console.log(this.totalMinutesPerDay)
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
      totalMinutes = totalMinutes/data.length
     // console.log('El total de minutos es: ', totalMinutes);
      
    })

    return totalMinutes
  }
  searchByDates2($event: any): void {
    // console.log($event.value);
    // {
    //   date: 2021-09-21
    // }
    this.dataHistory2 = []
    this.apiService.getDatabyDate({ date: $event.value ? $event.value : $event }).subscribe(res => {
      this.getDataHistory2(res)
    })
  }
  getDataHistory2(data: object[]): void {
    data.map((val: any) => {
      if (val.tipo == 5) {
        this.dataHistory2.push({
          date: val.fecha_inicio.split('T')[0],
          startTime: val.fecha_inicio.split('T')[1].split('.')[0],
          endTime: val.fecha_fin.split('T')[1].split('.')[0]
        })
      }
    })
  }
  getDataThendGraphMuchoUso(data): void {

    let hash = {};
    let conteo=0
    
    data = data.filter(r => r.tipo == 5).filter(o => hash[o.fecha_inicio.split('T')[0]] ? false : hash[o.fecha_inicio.split('T')[0]] = true);

    data.map((val: any) => {
      if (val.tipo == 5) {
        conteo=conteo+1
        this.labelsThend6.push(val.fecha_fin.split('T')[0])
        this.dataThend6.push(conteo)
        this.vecesExcedidas=this.vecesExcedidas+conteo
      }
    })
    this.labelsThend6.reverse()
    this.dataThend6.reverse()

    // 1. Thend graph
    this.typeGraph6 = 'line';
    this.data6 = {
      labels: this.labelsThend6,
      datasets: [
        {
          label: "Veces que se excedio el tiempo limite",
          data: this.dataThend6,
          fill: false,
          borderColor: '#dd3b56',
          tension: 0.1
        }
      ]
    };
  }
  insertData(): void {
    let data = {
      "tipo": 6,
      "valor": 21,
      "estado": 1,
      "dias": -3
    }

    this.apiService.insertData(data).subscribe(res => {
      console.log(res);
    })

  }


}




