import NotFound from '@/common/pages/NotFound';
import { Badge } from '@/common/ui/badge';
import { Button } from '@/common/ui/button';
import { Card, CardContent, CardTitle } from '@/common/ui/card';
import { Map } from '@/common/ui/map';
import { Separator } from '@/common/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom'

const FloodEventDetail = () => {

	const { id } = useParams();
	const navigate = useNavigate();

	if (!id) return <NotFound />;

	const dummyData = {
		name: "Tumaga",
		risk: "critical",
		date: "June 10, 2026",
		time: "9:08",

		duration: 6,
		startTime: "9:08",
		endTime: "3:14",

		peakRainfall: 52.3,
		damLevelPeak: .87,
	};

	const floodSummary = "Continuous rainfall from Typhoon Batang triggered a critical event in Barangay Tumaga. The Pasonanca Dam reached 87% capacity causing overflow into residential zones. Approx. 340 families displaced. DRRM teams deployed within 16 minutes of alert.";

	const impactStatistics = {
		usersAffected: 2840,
		alertsSent: 2840,
		usersSafelyEvacuated: 2840
	}

	const timeline = [
		{time: "9:08", title: "Alert Triggered", content: "MCDA calculated critical level risks from its recent data."},
		{time: "9:10", title: "Alerts Dispatched", content: "SMS + Push Alerts to 2840 registered users."},
		{time: "9:24", title: "DRRM Deployed", content: "Rescue teams mobilized to 14-flood prone zones."},
		{time: "3:14", title: "All Clear Issues", content: "Water levels receded below safe thresholds. Event closed."},
	]

	const affectedAreasMap = {
		lon: 122.079483,
		lat: 6.943376
	}

	const timelineList = timeline.map(({time, title, content}, index) => 
		<div key={index}>
			<h5 className='text-sm text-black/50'>{time}</h5>
			<h1 className='text-md font-semibold'>{title}</h1>
			<p className='text-xs text-black/50'>{content}</p>
		</div>
	)

	return (
		<>
			<div className='p-4'>
				<Button size="xs" variant="link" onClick={() => navigate(-1)}><ArrowLeft />Go Back to Main History Page</Button>
				<div className='flex gap-4 items-center'>
					<h1 className='text-2xl font-semibold'>Flood History: Barangay {dummyData.name}</h1>
					<Badge variant="destructive" className='uppercase'>{dummyData.risk}</Badge>
				</div>
				<p className='text-xs text-black/50'>{dummyData.date} - Event ID: #{id}-FFFF</p>
				<div className='grid grid-flow-col gap-2 my-4 w-full h-full'>
					<Card size='sm'>
						<h5 className='text-xs font-semibold uppercase text-black/50'>Date</h5>
						<h1 className='text-lg font-semibold'>{dummyData.date}</h1>
						<p className='text-xs text-black/50'>{dummyData.time} ON SET</p>
					</Card>
					<Card size='sm'>
						<h5 className='text-xs font-semibold uppercase text-black/50'>Barangay</h5>
						<h1 className='text-lg font-semibold'>{dummyData.name}</h1>
					</Card>
					<Card size='sm'>
						<h5 className='text-xs font-semibold uppercase text-black/50'>Duration</h5>
						<h1 className='text-lg font-semibold'>{dummyData.duration} hours</h1>
						<p className='text-xs text-black/50'>{dummyData.startTime} - {dummyData.endTime}</p>
					</Card>
					<Card size='sm'>
						<h5 className='text-xs font-semibold uppercase text-black/50'>Peak Rainfall</h5>
						<h1 className='text-lg font-semibold'>{dummyData.peakRainfall} mm/hr</h1>
						<p className='text-xs text-black/50'>Extreme Intensity</p>
					</Card>
					<Card size='sm'>
						<h5 className='text-xs font-semibold uppercase text-black/50'>Dam Peak Level</h5>
						<h1 className='text-lg font-semibold'>{dummyData.damLevelPeak * 100} %</h1>
						<p className='text-xs text-black/50'>Pasonanca Dam</p>
					</Card>
				</div>
				<div className='flex gap-2'>
					<Card className='w-full'>
						<CardTitle>
							Flood Summary
						</CardTitle>
						<Separator></Separator>
						<CardContent>
							<p>{floodSummary}</p>
						</CardContent>
						<Separator></Separator>

						<CardTitle>Impact Statistics</CardTitle>
						<Separator></Separator>
						<CardContent className='flex flex-row gap-2'>
							<Card size='sm'>
								<h5 className='text-xs font-semibold uppercase text-black/50'>Users Affected</h5>
								<h1 className='text-lg font-semibold text-center'>{impactStatistics.usersAffected}</h1>
							</Card>
							<Card size='sm'>
								<h5 className='text-xs font-semibold uppercase text-black/50'>Alerts Dispatched</h5>
								<h1 className='text-lg font-semibold text-center'>{impactStatistics.alertsSent}</h1>
							</Card>
							<Card size='sm'>
								<h5 className='text-xs font-semibold uppercase text-black/50'>Users Evacuated</h5>
								<h1 className='text-lg font-semibold text-center'>{impactStatistics.usersSafelyEvacuated}</h1>
							</Card>
						</CardContent>
					</Card>

					<Card className='basis-1/3'>
						<CardTitle>
							Response Timeline
						</CardTitle>
						<Separator></Separator>
						
						<div className='flex flex-col gap-8'>
							{timelineList}
						</div>
					</Card>

					<Card className='h-120 w-full'>
						<CardTitle className='flex flex-row justify-between'>
							Affected Area (Map)
							<span className='text-xs text-black/50'>
								Longitude: {affectedAreasMap.lon} | Latitude: {affectedAreasMap.lat}
							</span>
						</CardTitle>
						<Separator></Separator>
						<Map center={[affectedAreasMap.lon, affectedAreasMap.lat]} zoom={14} theme='light' >
						</Map>
					</Card>
				</div>
			</div>
		</>
	)
}

export default FloodEventDetail