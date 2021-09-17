import { Component } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Smart Chair';
  dataHistory = []
  data

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getAllData().subscribe(res => {
      res.map((val: any) => {                
        this.dataHistory.push({
          date: val.fecha_inicio.split('T')[0],
          startTime: val.fecha_inicio.split('T')[1].split('.')[0],
          endTime: val.fecha_fin.split('T')[1].split('.')[0]
        })
      })      
      console.log('Data', this.dataHistory);
    })
  }

  

  // 1. Thend graph
  type = 'line';
  data1 = {
    labels: ["01/09/2021", "02/09/2021", "03/09/2021", "04/09/2021", "05/09/2021", "06/09/2021", "07/09/2021"],
    datasets: [
      {
        label: "Peso en kg",
        data: [65, 66, 67, 65, 69, 64, 71],
        fill: false,
        borderColor: '#dd3b56',
        tension: 0.1
      }
    ]
  };


  // 2. Bar graph
  type2 = 'bar';
  labelsBar = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']
  data2 = {
    labels: this.labelsBar,
    datasets: [{
      label: 'Cantidad',
      data: [6, 5, 8, 8, 5, 7, 5, 4],
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
  };

  //General options for graphics
  options = {
    responsive: true,
    // maintainAspectRatio: false
  };



  test($event: any) {
    console.log('Test', $event.value);

  }



}


