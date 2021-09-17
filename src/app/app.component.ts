import { Component } from '@angular/core';
import { dataD } from './data/data.constants';
import { ApiService } from './services/api.service';

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
  typeGraph1: string
  typeGraph2: string
  data1 = {}
  data2 = {}
  data = []
  contDias = [0, 0, 0, 0, 0, 0, 0]


  constructor(private apiService: ApiService) { }

  ngOnInit() {
    // this.apiService.getAllData().subscribe(res => {

    // console.log(res);
    let res = dataD
    this.data = res
    this.getDataThendGraph(res)
    this.getDataHistory(res)
    this.getDataBarGraph(res)

    // })
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
        borderWidth: 1
      }]
    }

  }

  //General options for graphics
  options = {
    responsive: true,
    // maintainAspectRatio: false
  };

  test($event: any) {
    console.log('Test', $event.value);
    let test = this.data.filter(r=> r.fecha_fin.split('T')[1].split('.')[0] == $event.value)
  }
}


