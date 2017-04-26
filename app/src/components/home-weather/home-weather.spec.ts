import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HomeWeather } from './home-weather';
import { IonicModule } from 'ionic-angular/index';

describe('HomeWeather Component', () => {
    
    let component: HomeWeather;
    let fixture: ComponentFixture<HomeWeather>;
    let de: DebugElement;
    let el: HTMLElement;
    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HomeWeather],
            imports: [IonicModule.forRoot(HomeWeather)]
        });
    }));
    
    beforeEach(() => {
        fixture = TestBed.createComponent(HomeWeather);
        
        component = fixture.componentInstance;
        
        de = fixture.debugElement.query(By.css('.home-weather > div'));
        el = de.nativeElement;
    });
    
    it('should initialize a weather property', () => {
        expect(component.weather instanceof Object);
    });
    
    it('should not load weather component without weather', () => {
        
    });
    
    it('should get weather based on current location', () => {
        
    });
    
    it('should populate weather property with weather info', () => {
        
    });
    
    it('should load weather component after updating property', () => {
        
    });
});