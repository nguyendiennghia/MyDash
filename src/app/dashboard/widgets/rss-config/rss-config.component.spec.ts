import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RssConfigComponent } from './rss-config.component';

describe('RssConfigComponent', () => {
  let component: RssConfigComponent;
  let fixture: ComponentFixture<RssConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RssConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RssConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
