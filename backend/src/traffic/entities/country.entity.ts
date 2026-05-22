import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { TrafficRecord } from './traffic-record.entity';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 3, unique: true })
  code: string;

  @OneToMany(() => TrafficRecord, (record) => record.country)
  trafficRecords: TrafficRecord[];

  @CreateDateColumn()
  createdAt: Date;
}
