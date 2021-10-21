import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightMoveComponent } from './right-move.component';

describe('RightMoveComponent', () => {
  let component: RightMoveComponent;
  let fixture: ComponentFixture<RightMoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RightMoveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RightMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
