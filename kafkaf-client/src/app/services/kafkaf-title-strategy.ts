import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class KafkafTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    let title = this.buildTitle(snapshot);

    if (title) {
      const [cluster, broker, topic] = (function (paramMap) {
        return [paramMap?.get('cluster'), paramMap?.get('broker'), paramMap?.get('topic')];
      })(snapshot.root.firstChild?.paramMap);

      if (cluster) {
        title = title.replace('%cluster%', cluster);
      }

      if (broker) {
        title = title.replace('%broker%', broker);
      }

      if (topic) {
        title = title.replace('%topic%', topic);
      }

      this.title.setTitle(title);
    }
  }
}
