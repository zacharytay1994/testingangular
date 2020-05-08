import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private itemID: string = 'T4_BAG';
  private heroesUrl = `https://www.albion-online-data.com/api/v2/stats/prices/${this.itemID}?locations=Caerleon&qualities=2`;
  private read: boolean = false;

  constructor(private http: HttpClient, private messageService: MessageService) {}

  private itemIDs: string[] = ['T4_BAG', 'T5_BAG'];
  private itemMap: Map<string, string>;

  readText(): Promise<any> {
    var promise = new Promise((resolve, reject) => {
      if (!this.read) {
        this.http.get('assets/AOItemIDs.txt', {responseType: 'text'}).subscribe(data => 
          (this.itemMap = this.parseToMap(data.split('\n')),
          console.log(this.itemMap),
          this.read = true,
          resolve()
        ))
      }
      else {
        resolve();
      }
    }) 
    return promise;
  }

  parseToMap(array: string[]): Map<string, string> {
    let itemMap = new Map<string, string>();
    let counter: number = 0;
    let key: string = '';
    array.forEach (function(value) {
      // if odd
      if (counter%2==0) {
        key = value;
      }
      else {
        itemMap[key] = value;
      }
      counter++;
    })
    return itemMap;
  }

  getHeroes(): Observable<Hero[]> {
    const data = this.itemIDs.map(element => {
      this.itemID = element;
      //console.log(element);
      return this.http.get<Hero[]>(this.heroesUrl).pipe(
        tap(_ => this.log(`fetched hero`)),
        catchError(this.handleError<Hero[]>(`getHero : error`))
      );
    })
    return forkJoin(...data);
  }

  gettHeroes(): Observable<Hero[][]> {
    let array: Observable<Hero[]>[] = [];
    console.log(this.itemIDs);
    let itemid: string[] = [];
    console.log(this.itemMap);
    let iterationcount: number = 0;
    let concatcount: number = 0;
    let ids: string = "";
    for (var i in this.itemMap) {
      if (iterationcount > 20) {
        break;
      }
      if (concatcount < 50) {
        concatcount++;
        ids += i + ","
        console.log(ids);
      }
      else {
        ids += i;
        iterationcount++;
        concatcount = 0;
        itemid.push(ids);
        ids = "";
      }
    }
    console.log(itemid);
    array = itemid.map(id => {
      this.itemID = id;
      console.log(`https://www.albion-online-data.com/api/v2/stats/prices/${id}?locations=Caerleon&qualities=0`);
      return this.http.get<Hero[]>(`https://www.albion-online-data.com/api/v2/stats/prices/${id}?locations=Caerleon&qualities=0`)
    })
    let test: Observable<Hero[][]> = forkJoin(array);
    console.log(test);
    return test;
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }
}
