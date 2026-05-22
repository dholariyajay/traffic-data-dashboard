import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Country } from './country.entity';

@Entity('traffic_records')
@Index(['countryId', 'vehicleType'])
export class TrafficRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Country, (country) => country.trafficRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column({ name: 'country_id' })
  countryId: number;

  @Column({ length: 20 })
  vehicleType: string;

  @Column('integer')
  count: number;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  recordedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
