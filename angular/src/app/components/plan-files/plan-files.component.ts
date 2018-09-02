import { Component, OnInit, Input } from '@angular/core';
import { FileService } from '../../services/file.service';
import { File } from '../../models/File';
import { Planning } from '../../models/Planing';
import { PlanningService } from '../../services/planning.service';

@Component({
    selector: 'plan-files',
    styleUrls: ['./plan-files.component.css'],
    templateUrl: './plan-files.component.html'
})
export class PlanFilesComponent implements OnInit {

    @Input() plan: Planning;

    constructor(
        private fileService: FileService,
        private planningService: PlanningService
    ) { }

    ngOnInit() { }

    downloadFile(file: File) {
        this.fileService.downloadFile(file);
    }


    deleteFileFromPlan(index) {
        this.planningService.deleteFileFromPlan(this.plan, index);
    }

}
