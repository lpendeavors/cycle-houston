import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Tabs } from './tabs';
import { Home } from '../home/home';
import { Ride } from '../ride/ride';
import { Profile } from '../profile/profile';
import { IonicModule, Platform, NavController } from 'ionic-angular';
import { PlatformMock } from '../../../test-config/mocks-ionic';

describe('Tabs Component', () => {
    let de: DebugElement;
    let component: Tabs;
    let fixture: ComponentFixture<Tabs>;

    beforeEach(async(()=> {
        TestBed.configureTestingModule({
            declarations: [Tabs],
            imports: [
                IonicModule.forRoot(Tabs)
            ],
            providers: [
                NavController,
                { provide: Platform, useClass: PlatformMock }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Tabs);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        expect(component instanceof Tabs).toBe(true);
    });

    it('should have a Home tab', () => {
        expect(component.tab1Root).toEqual(Home);
    });

    it('should have a Ride tab', () => {
        expect(component.tab2Root).toEqual(Ride);
    });

    it('should have a Profile tab', () => {
        expect(component.tab3Root).toEqual(Profile);
    });
})