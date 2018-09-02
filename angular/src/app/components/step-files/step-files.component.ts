import { Component, OnInit, Input } from '@angular/core';
import { FileService } from '../../services/file.service';
import { File } from '../../models/File';
import { PlanningService } from '../../services/planning.service';
import { Step } from '../../models/Step';
import { Planning } from '../../models/Planing';

@Component({
    selector: 'step-files',
    styleUrls: ['./step-files.component.css'],
    templateUrl: './step-files.component.html'
})
export class StepFilesComponent implements OnInit {

    @Input() plan: Planning;
    @Input() step: Step;

    constructor(
        private fileService: FileService,
        private planningService: PlanningService
    ) { }

    ngOnInit() { }

    downloadFile(file: File) {
        this.fileService.downloadFile(file);
    }

    deleteFileFromStep(index, step) {
        this.findStep(step._id, (step) => {
            step.files.splice(index, 1);
        });
        this.planningService.setPlanning(this.plan);
    }


    private findStep(stepid, cb) {
        this.plan.steps.forEach(step => {
            if (step._id == stepid) {
                cb(step);
            }
        });
    }

}
