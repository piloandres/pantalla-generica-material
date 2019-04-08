import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinicionParametrosComponent } from './definicion-parametros.component';

describe('DefinicionParametrosComponent', () => {
  let component: DefinicionParametrosComponent;
  let fixture: ComponentFixture<DefinicionParametrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefinicionParametrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefinicionParametrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
