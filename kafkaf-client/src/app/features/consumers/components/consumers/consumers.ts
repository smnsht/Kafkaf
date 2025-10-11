import { Component } from '@angular/core';

import { KafkafTableDirective, PageWrapper } from '@app/shared';

@Component({
  selector: 'app-consumers',
  imports: [PageWrapper, KafkafTableDirective],
  templateUrl: './consumers.html',
})
export class Consumers {}
