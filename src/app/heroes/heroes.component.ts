import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  hero: Hero = {
    id: 1,
    name: "Windstorm"
  }

  heroes: Hero[];

  constructor(private heroService: HeroService, private messageService: MessageService) { }

  getHeroes(): void {
    this.heroService.readText().then(() =>
      this.heroService.gettHeroes().subscribe(innervalue => 
        this.heroes = this.gimmeThatArray(innervalue)));
  }

  gimmeThatArray(hero: Hero[][]): Hero[] {
    let heroutput: Hero[] = [];
    hero.forEach(function (value) {
      value.forEach(function (valueinside) {
        heroutput.push(valueinside);
      })
    });
    console.log(heroutput);
    return heroutput;
  }

  ngOnInit(): void {
    this.getHeroes();
  }
}
